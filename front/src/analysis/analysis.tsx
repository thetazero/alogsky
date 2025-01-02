import { TrainingData, LiftData, RunData, pounds, SleepData, InverseSpeed, minutes_per_mile, InjuryData, PainSnapshotData, BodyLocation } from "../types";
import { Mass } from "@buge/ts-units/mass";
import { lift_tonage } from "./metrics";
import { Length, miles } from "@buge/ts-units/length";
import { hours, minutes, seconds, Time } from "@buge/ts-units/time";
import { DataPoint } from "../components/Chart";
import { fmt_minutes_per_mile } from "../utils/format";
import { get_week_end, get_week_start } from "../utils/time";

export enum Metric {
    Mileage = "Mileage",
    Pace = "Pace",
    ActiveTime = "Active Time",
}

class Analysis {
    runs: RunData[]
    lifts: LiftData[]
    sleeps: SleepData[]
    training_data: TrainingData[]
    pain_snapshot_data: PainSnapshotData[]
    first_activity: Date | null

    constructor(training_data: TrainingData[]) {
        this.runs = training_data.filter(e => {
            return e.type === "run"
        })
        this.lifts = training_data.filter(e => e.type === "lift")
        this.training_data = training_data
        this.sleeps = training_data.filter(e => e.type === "sleep")
        this.pain_snapshot_data = this.training_data.filter(e => e.type === "injury")
        this.first_activity = this._get_oldest_date()
    }

    _get_oldest_date(): Date | null {
        if (this.training_data.length == 0) return null
        return this.training_data.map(d => d.date).reduce((a, b) => {
            if (a.getTime() < b.getTime()) return a
            return b
        })
    }

    number_of_weeks(): number {
        if (this.training_data.length === 0) return 0
        const oldest_date = this._get_oldest_date() as Date
        const oldest_start = get_week_start(oldest_date) as Date
        const now = new Date()
        const weeks = Math.ceil((now.getTime() - oldest_start.getTime()) / (1000 * 60 * 60 * 24 * 7))
        return weeks
    }

    date_range_for_week(idx: number): [Date, Date] {
        const oldest_date = this._get_oldest_date() as Date
        const oldest_start = get_week_start(oldest_date)
        const start = new Date(oldest_start.getTime() + idx * 7 * 24 * 60 * 60 * 1000)
        const end = get_week_end(start)
        return [start, end]
    }

    get_data_for_week(idx: number): TrainingData[] {
        if (this.training_data.length === 0) return []
        const [start, end] = this.date_range_for_week(idx)
        return this.training_data.filter(d => {
            return d.date.getTime() >= start.getTime() && d.date.getTime() < end.getTime()
        })
    }

    total_tonage(): Mass {
        if (this.lifts.length === 0) return pounds(0)
        return this.lifts.map(lift_tonage).reduce((a, b) => a.plus(b))
    }

    total_distance(): Length {
        return this.runs.map(r => r.distance).reduce((a, b) => a.plus(b), miles(0))
    }

    total_moving_time(): Time {
        return this.runs.map(r => r.moving_time).reduce((a, b) => a.plus(b), seconds(0))
    }

    training_time(): Time {
        return this.training_data.map(d => {
            if (d.type == "run") return d.moving_time
            if (d.type == "lift") return d.duration
            if (d.type == "injury") return minutes(0)
            if (d.type == "kayak") return d.duration
            if (d.type == "sleep") return minutes(0)
            throw "Training time does not cover all types"
        }).reduce((a, b) => a.plus(b), minutes(0))
    }

    average_sleep_time(): Time {
        const total_sleep_time = this.sleeps.map(s => s.duration).reduce((a, b) => a.plus(b), seconds(0))
        const total_sleep_data_points = this.sleeps.length
        if (total_sleep_data_points === 0) return seconds(0)
        return total_sleep_time.per(total_sleep_data_points)
    }

    average_pace(): InverseSpeed {
        const dist = this.total_distance()
        const time = this.total_moving_time()
        return time.per(dist)
    }

    split_into_weeks(): Analysis[] {
        const week_count = this.number_of_weeks()
        const res = []
        for (let i = 0; i < week_count; i++) {
            const data = this.get_data_for_week(i)
            res.push(new Analysis(data))
        }
        return res
    }

    get_metric(metric: Metric): DataPoint | null {
        if (!this.first_activity) return null
        switch (metric) {
            case Metric.Mileage:
                const dist = this.total_distance().in(miles).amount
                return {
                    date: this.first_activity,
                    y: dist,
                    label: `${dist.toFixed(1)} miles`
                }
            case Metric.ActiveTime:
                const time = this.training_time().in(hours).amount
                return {
                    date: this.first_activity,
                    y: time,
                    label: `${time.toFixed(1)} hours`
                }
            case Metric.Pace:
                const pace = this.average_pace()
                return {
                    date: this.first_activity,
                    y: pace.in(minutes_per_mile).amount,
                    label: fmt_minutes_per_mile(pace)
                }

        }
    }

    get_injury_data(): InjuryData[] {
        const map: Map<BodyLocation, InjuryData> = new Map([]);
        this.pain_snapshot_data.forEach(snapshot => {
            const date = snapshot.date
            snapshot.pains.forEach(pain => {
                const location = pain.location
                const list = map.get(location) ?? {
                    location,
                    snapshots: []
                }
                list.snapshots.push({
                    date,
                    description: pain.description,
                    pain: pain.pain
                })
                map.set(location, list)
            })
        })
        return Array.from(map.values()).map(injury_data => {
            injury_data.snapshots = injury_data.snapshots.sort(
                (a, b) => b.date.getTime() - a.date.getTime()
            )
            return injury_data
        })
    }
}

export default Analysis
