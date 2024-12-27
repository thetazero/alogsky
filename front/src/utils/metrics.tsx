import { Mass } from "@buge/ts-units/mass";
import { Exercise, LiftData, pounds, RepData } from "../types";

const bonus_weight: Map<Exercise, number> = new Map([
    [Exercise.Pullup, 1.0],
    [Exercise.Pushup, 1.0],
    [Exercise.SingleLegCalfRaise, 1.0],
    [Exercise.Situp, 0.8],
]);

function rep_tonage(rep: RepData) {
    const extra_weight = bonus_weight.get(rep.exercise) ?? 0.0;
    return (rep.weight.plus(pounds(125).times(extra_weight))).times(rep.reps);
}

export function total_tonage(lift: LiftData): Mass {
    return lift.reps.map(
        rep => {
            return rep_tonage(rep)
        }
    ).reduce((
        a, b
    ) => {
        return a.plus(b)
    })
}
