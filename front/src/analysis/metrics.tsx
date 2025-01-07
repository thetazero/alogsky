import { Mass } from "@buge/ts-units/mass";
import { Exercise, InverseSpeed, LiftData, pounds, RepData, RunData, TrainingData } from "../types";
import { miles } from "@buge/ts-units/length";
import { minutes, seconds, Time } from "@buge/ts-units/time";

const bonus_weight_map: Map<Exercise, number> = new Map([
    [Exercise.BulgarianSplitSquat, 0.7],
    [Exercise.Pullup, 1.0],
    [Exercise.Pushup, 0.7],
    [Exercise.SingleLegCalfRaise, 0.8],
    [Exercise.SingleLegStairCalfRaise, 0.8],
    [Exercise.Situp, 0.8],
]);

export function rep_tonage(rep: RepData) {
    const extra_weight_multiplier = bonus_weight_map.get(rep.exercise) ?? 0.0;
    const bonus_weight = pounds(125).times(extra_weight_multiplier)
    return (rep.weight.plus(bonus_weight)).times(rep.reps);
}

export function lift_tonage(lift: LiftData): Mass {
    return lift.reps.map(rep_tonage).reduce((a, b) => a.plus(b), pounds(0))
}

export function total_mileage(runs: RunData[]) {
    return runs.map(r => r.distance).reduce((a, b) => a.plus(b), miles(0))
}

export function total_tonage(lifts: LiftData[]): Mass {
    return lifts.map(lift_tonage).reduce((a, b) => a.plus(b), pounds(0))
}

export function total_moving_time(runs: RunData[]): Time {
    return runs.map(r => r.moving_time).reduce((a, b) => a.plus(b), seconds(0))
}

export function training_time(training_data: TrainingData[]): Time {
    return training_data.map(d => {
        if (d.type == "run") return d.moving_time
        if (d.type == "lift") return d.duration
        if (d.type == "pain") return minutes(0)
        if (d.type == "kayak") return d.duration
        if (d.type == "sleep") return minutes(0)
        throw "Training time does not cover all types"
    }).reduce((a, b) => a.plus(b), minutes(0))
}

export function average_pace(runs: RunData[]): InverseSpeed {
    const dist = total_mileage(runs)
    const time = total_moving_time(runs)
    return time.per(dist)
}
