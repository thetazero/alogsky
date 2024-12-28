import { TrainingData, LiftData, RunData, pounds, SleepData } from "../types";
import { Mass } from "@buge/ts-units/mass";
import { lift_tonage } from "./metrics";
import { Length, miles } from "@buge/ts-units/length";
import { seconds, Time } from "@buge/ts-units/time";

class Analysis {
    runs: RunData[]
    lifts: LiftData[]
    sleeps: SleepData[]
    training_data: TrainingData[]

    constructor(training_data: TrainingData[]) {

        this.runs = training_data.filter(e => {
            return e.type === "run"
        })
        this.lifts = training_data.filter(e => e.type === "lift")
        this.training_data = training_data
        this.sleeps = training_data.filter(e => e.type === "sleep")
    }

    _get_oldest_date(): Date {
        return this.training_data.map(d => d.date).reduce((a, b) => {
            if (a.getTime() < b.getTime()) return a
            return b
        })
    }

    number_of_weeks(): number {
        if (this.training_data.length === 0) return 0
        const oldest_date = this._get_oldest_date()
        const oldest_start = this.get_week_start(oldest_date)
        const now = new Date()
        const weeks = Math.ceil((now.getTime() - oldest_start.getTime()) / (1000 * 60 * 60 * 24 * 7))
        return weeks
    }

    date_range_for_week(idx: number): [Date, Date] {
        const oldest_date = this._get_oldest_date()
        const oldest_start = this.get_week_start(oldest_date)
        const start = new Date(oldest_start.getTime() + idx * 7 * 24 * 60 * 60 * 1000)
        const end = this.get_week_end(start)
        return [start, end]
    }

    get_data_for_week(idx: number): TrainingData[] {
        if (this.training_data.length === 0) return []
        const [start, end] = this.date_range_for_week(idx)
        return this.training_data.filter(d => {
            return d.date.getTime() >= start.getTime() && d.date.getTime() < end.getTime()
        })
    }


    get_week_start(date: Date): Date {
        date = new Date(date)
        const day = (date.getDay() -1) % 7
        date.setHours(-24 * day)
        date.setHours(0)
        date.setMilliseconds(0)
        return date
    }

    get_week_end(date: Date): Date {
        date = this.get_week_start(date)
        date.setHours(24 * 6)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
    }

    total_tonage(): Mass {
        if (this.lifts.length === 0) return pounds(0)
        return this.lifts.map(lift_tonage).reduce((a, b) => a.plus(b))
    }

    total_distance(): Length {
        if (this.runs.length === 0) return miles(0)
        return this.runs.map(r => r.distance).reduce((a, b) => a.plus(b))
    }

    training_time(): Time {
        const run_training_time = this.runs.map(r => r.moving_time).reduce((a, b) => a.plus(b), seconds(0))
        const lift_training_time = this.lifts.map(l => l.duration).reduce((a, b) => a.plus(b), seconds(0))
        return run_training_time.plus(lift_training_time)
    }

    average_sleep_time(): Time {
        const total_sleep_time = this.sleeps.map(s => s.duration).reduce((a, b) => a.plus(b), seconds(0))
        const total_sleep_data_points = this.sleeps.length
        if (total_sleep_data_points === 0) return seconds(0)
        return total_sleep_time.per(total_sleep_data_points)
    }
}

export default Analysis
