import { TrainingData, LiftData, RunData, SleepData, minutes_per_mile, PainLogData, Metric, tons, PainAtLocationData } from "../types";
import { Mass } from "@buge/ts-units/mass";
import { average_pace, total_mileage, total_tonage, training_time as total_training_time } from "./metrics";
import { Length, miles } from "@buge/ts-units/length";
import { hours, seconds, Time } from "@buge/ts-units/time";
import { get_week_end, get_week_start } from "../utils/time";
import { Dimensions, Quantity, Unit } from "@buge/ts-units";

export class TrainingDataSet {
    data: TrainingData[]

    runs: RunData[]
    lifts: LiftData[]
    sleeps: SleepData[]
    pain_snapshot_data: PainLogData[]

    private _first_activity: Date | null
    private _last_activity: Date | null
    private _splitWeeks: TrainingDataSet[]

    constructor(data: TrainingData[]) {
        this.data = data.sort((a, b) => a.date.getTime() - b.date.getTime())
        this.runs = data.filter(e => e.type === "run")
        this.lifts = data.filter(e => e.type === "lift")
        this.sleeps = data.filter(e => e.type === "sleep")
        this.pain_snapshot_data = data.filter(e => e.type === "pain")

        this._first_activity = this.data.map(d => d.date).reduce((a: Date | null, b: Date | null) => {
            if (a && b && a.getTime() < b.getTime()) return a
            return b
        }, null)
        this._last_activity = this.data.map(d => d.date).reduce((a: Date | null, b: Date | null) => {
            if (a && b && a.getTime() > b.getTime()) return a
            return b
        }, null)

        if (this.number_of_weeks() === 1) {
            this._splitWeeks = [this]
        } else {
            this._splitWeeks = []
            for (let i = 0; i < this.number_of_weeks(); i++) {
                this._splitWeeks.push(this._dataset_for_week(i))
            }
        }
    }

    number_of_weeks(): number {
        if (!this._first_activity || !this._last_activity) return 0
        const first_activity_week_start = get_week_start(this._first_activity)
        return Math.ceil((this._last_activity.getTime() - first_activity_week_start.getTime()) / (1000 * 60 * 60 * 24 * 7))
    }

    date_range_for_week(idx: number): [Date, Date] {
        if (!this._first_activity) throw new Error("No data")
        const oldest_date = this._first_activity
        const oldest_start = get_week_start(oldest_date)
        const start = new Date(oldest_start.getTime() + idx * 7 * 24 * 60 * 60 * 1000)
        const end = get_week_end(start)
        return [start, end]
    }

    _dataset_for_week(idx: number): TrainingDataSet {
        if (idx >= this.number_of_weeks()) return new TrainingDataSet([])
        else if (idx < 0) new TrainingDataSet([])

        const [start, end] = this.date_range_for_week(idx)
        let week_data = (this.data.filter(d => {
            return d.date.getTime() >= start.getTime() && d.date.getTime() < end.getTime()
        }))
        return new TrainingDataSet(week_data)
    }

    analysis_for_week(idx: number): Analysis {
        if (idx >= this.number_of_weeks() || idx < 0) return new Analysis(new TrainingDataSet([]))
        return new Analysis(this._splitWeeks[idx])
    }
}

class Analysis {
    dataset: TrainingDataSet

    constructor(dataset: TrainingDataSet) {
        this.dataset = dataset
    }

    average_sleep_time(): Time | null {
        const total_sleep_time = this.dataset.sleeps.map(s => s.duration).reduce((a, b) => a.plus(b), seconds(0))
        const total_sleep_data_points = this.dataset.sleeps.length
        if (total_sleep_data_points === 0) return null
        return total_sleep_time.per(total_sleep_data_points)
    }

    total_mileage(): Length {
        return total_mileage(this.dataset.runs)
    }

    total_training_time(): Time {
        return total_training_time(this.dataset.data)
    }

    total_tonage(): Mass {
        return total_tonage(this.dataset.lifts)
    }

    get_metric(metric: Metric): Quantity<number, Dimensions> {
        switch (metric) {
            case Metric.Mileage:
                return this.total_mileage().in(miles)
            case Metric.ActiveTime:
                return this.total_training_time().in(hours)
            case Metric.Pace:
                return average_pace(this.dataset.runs).in(minutes_per_mile)
            case Metric.Tonage:
                return this.total_tonage().in(tons)
        }
    }

    get_injury_data(): PainAtLocationData[] {
        const map: Map<string, PainAtLocationData> = new Map([]);
        this.dataset.pain_snapshot_data.forEach(snapshot => {
            const date = snapshot.date
            snapshot.pains.forEach(pain => {
                const location = pain.location
                const pain_at_location: PainAtLocationData = map.get(location.to_string()) ?? {
                    location,
                    snapshots: [],
                }
                pain_at_location.snapshots.push({
                    date,
                    description: pain.description,
                    pain: pain.pain
                })
                map.set(location.to_string(), pain_at_location)
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

export function get_unit_for_metric(metric: Metric): Unit<number, Dimensions> {
    switch (metric) {
        case Metric.Mileage:
            return miles
        case Metric.ActiveTime:
            return hours
        case Metric.Pace:
            return minutes_per_mile
        case Metric.Tonage:
            return tons
    }
}
