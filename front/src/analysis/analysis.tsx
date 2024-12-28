import { TrainingData, LiftData, RunData, pounds } from "../types";
import { Mass } from "@buge/ts-units/mass";
import { lift_tonage } from "./metrics";

class Analysis {
    runs: RunData[]
    lifts: LiftData[]
    training_data: TrainingData[]

    constructor(training_data: TrainingData[]) {

        this.runs = training_data.filter(e => {
            return e.type === "run"
        })
        this.lifts = training_data.filter(e => e.type === "lift")
        this.training_data = training_data
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
        const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
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
        const day = date.getDay() % 7
        date.setHours(-24 * day)
        date.setHours(0)
        date.setMilliseconds(0)
        return date
    }

    get_week_end(date: Date): Date {
        date = this.get_week_start(date)
        date.setHours(24 * 7)
        return date
    }

    total_tonage(): Mass {
        if (this.lifts.length === 0) return pounds(0)
        return this.lifts.map(lift_tonage).reduce((a, b) => a.plus(b))
    }
}

export default Analysis
