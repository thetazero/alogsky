import { TrainingData, LiftData, RunData, pounds, SleepData, InverseSpeed, minutes_per_mile, PainData, PainSnapshotData, BodyLocation, Metric, tons } from "../types";
import { Mass } from "@buge/ts-units/mass";
import { average_pace, lift_tonage, total_mileage, total_moving_time, total_tonage, training_time as total_training_time } from "./metrics";
import { Length, miles } from "@buge/ts-units/length";
import { hours, minutes, seconds, Time } from "@buge/ts-units/time";
import { DataPoint } from "../components/Chart";
import { fmt_minutes_per_mile } from "../utils/format";
import { get_week_end, get_week_start } from "../utils/time";

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
        this.pain_snapshot_data = this.training_data.filter(e => e.type === "pain")
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

    get_analysis_for_week(idx: number): Analysis {
        return new Analysis(this.get_data_for_week(idx))
    }

    average_sleep_time(): Time | null {
        const total_sleep_time = this.sleeps.map(s => s.duration).reduce((a, b) => a.plus(b), seconds(0))
        const total_sleep_data_points = this.sleeps.length
        if (total_sleep_data_points === 0) return null
        return total_sleep_time.per(total_sleep_data_points)
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

    total_mileage(): Length {
        return total_mileage(this.runs)
    }

    total_training_time(): Time {
        return total_training_time(this.training_data)
    }

    total_tonage(): Mass {
        return total_tonage(this.lifts)
    }

    get_metric(metric: Metric): number {
        switch (metric) {
            case Metric.Mileage:
                return this.total_mileage().in(miles).amount
            case Metric.ActiveTime:
                return this.total_training_time().in(hours).amount
            case Metric.Pace:
                return average_pace(this.runs).in(minutes_per_mile).amount
            case Metric.Tonage:
                return this.total_tonage().in(tons).amount
        }
    }

    get_metric_for_week(metric: Metric, week: number): number {
        return this.get_analysis_for_week(week).get_metric(metric)
    }

    get_metric_for_chart(metric: Metric): DataPoint | null {
        if (!this.first_activity) return null
        const y = this.get_metric(metric)
        switch (metric) {
            case Metric.Mileage:
                return {
                    date: this.first_activity,
                    y,
                    label: `${y.toFixed(1)} miles`
                }
            case Metric.ActiveTime:
                return {
                    date: this.first_activity,
                    y,
                    label: `${y.toFixed(1)} hours`
                }
            case Metric.Pace:
                const pace = average_pace(this.runs)
                return {
                    date: this.first_activity,
                    y: pace.in(minutes_per_mile).amount,
                    label: fmt_minutes_per_mile(pace)
                }

        }
    }

    get_injury_data(): PainData[] {
        const map: Map<BodyLocation, PainData> = new Map([]);
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
                (a, b) => a.date.getTime() - b.date.getTime()
            )
            return injury_data
        })
    }
}

export default Analysis
