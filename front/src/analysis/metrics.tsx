import { Mass } from "@buge/ts-units/mass";
import { BodyRegion, Exercise, InverseSpeed, LiftData, minutes_per_mile, PainLogData, pounds, RepData, RunData, TrainingData, unitless } from "../types";
import { meters, miles } from "@buge/ts-units/length";
import { minutes, seconds, Time } from "@buge/ts-units/time";
import { One, Quantity } from "@buge/ts-units";

const bonus_weight_map: Map<Exercise, number> = new Map([
    [Exercise.BulgarianSplitSquat, 0.7],
    [Exercise.Crunch, 0.1],
    [Exercise.DeadBugs, 0.1],
    [Exercise.FourtyFiveDegreeBackExtension, 0.3],
    [Exercise.LemonSqueezers, 0.2],
    [Exercise.OneLegBuck, 0.4],
    [Exercise.Plank, 0.02],
    [Exercise.Pullup, 1.0],
    [Exercise.Pushup, 0.7],
    [Exercise.RushNTwist, 0.1],
    [Exercise.SingleLegCalfRaise, 0.8],
    [Exercise.SingleLegStairCalfRaise, 0.8],
    [Exercise.Situp, 0.15],
    [Exercise.SpeedSkaterJumps, 0.05],
    [Exercise.SupineKneeDrive, 0.1],
]);

export function rep_tonage(rep: RepData) {
    const extra_weight_multiplier = bonus_weight_map.get(rep.exercise) ?? 0.0;
    const bonus_weight = pounds(125).times(extra_weight_multiplier)
    if (rep.length) {
        if (rep.exercise == Exercise.FarmerCary) {
            const length_multiplier = rep.length.in(meters).amount / 2;
            return rep.weight.times(rep.reps).times(length_multiplier);
        }
    }
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
        if (d.type == "note") return minutes(0)
        throw "Training time does not cover all types"
    }).reduce((a, b) => a.plus(b), minutes(0))
}

export function average_pace(runs: RunData[]): InverseSpeed {
    const dist = total_mileage(runs)
    const time = total_moving_time(runs)
    if (time.amount == 0) return minutes_per_mile(0)
    return time.per(dist)
}

export function fatigue_by_region(data: PainLogData): Map<BodyRegion, number> {
    const templates: [BodyRegion, number][] = data.pains.map(
        pain => {
            return [
                pain.location.region(),
                pain.pain
            ]
        }
    );
    const region_fatigue: Map<BodyRegion, number> = new Map([]);
    templates.forEach(([region, pain]) => {
        const current = region_fatigue.get(region) ?? 0;
        region_fatigue.set(region, Math.max(current, pain));
    });
    return region_fatigue
}

function body_region_to_fatgue_weight(region: BodyRegion): number {
    switch (region) {
        case BodyRegion.Ankle:
            return 1.0
        case BodyRegion.Arm:
            return 0.5
        case BodyRegion.Back:
            return 1.0
        case BodyRegion.Chest:
            return 0.5
        case BodyRegion.Core:
            return 1.0
        case BodyRegion.Foot:
            return 1.0
        case BodyRegion.Hamstring:
            return 3.0
        case BodyRegion.Hip:
            return 2.0
        case BodyRegion.Knee:
            return 3.0
        case BodyRegion.LowerLeg:
            return 2.0
        case BodyRegion.Quad:
            return 3.0
        case BodyRegion.Shoulder:
            return 0.5
    }
}

export function fatigue(data: PainLogData): Quantity<number, One> {
    // Use the templates variable or remove it if not needed
    const region_fatigue = fatigue_by_region(data)
    let fatigue = 0;
    Array.from(region_fatigue.entries()).forEach((pair) => {
        const [region, pain] = pair;
        fatigue += pain * body_region_to_fatgue_weight(region)
    });
    return unitless(fatigue);
}
