import { Mass } from "@buge/ts-units/mass";
import { LiftData } from "../types";

export function total_tonage(lift: LiftData): Mass {
    return lift.reps.map(
        rep => {
            return rep.weight.times(rep.reps)
        }
    ).reduce((
        a, b
    ) => {
        return a.plus(b)
    })
}
