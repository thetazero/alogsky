import { minutes, seconds, Time } from "@buge/ts-units/time";
import { Exercise, LiftData, minutes_per_mile, PainLogData, pounds, RepData, RunData, RunningWorkoutData, seconds_per_meter, Side, unitless } from "../types";
import { fastest_pace, fatigue, rep_tonage, total_tonage } from "./metrics";
import { kilograms } from "@buge/ts-units/mass";
import { BodyLocationWithSide, Calf, LowerBack, UpperBack } from "../pt/body_location";
import { Length, meters, miles } from "@buge/ts-units/length";

describe("Test rep tonage metric", () => {
    it('Works on 1 rep', () => {
        const rep_data: RepData = {
            exercise: Exercise.Squat,
            reps: 1,
            weight: kilograms(50)
        }
        expect(rep_tonage(rep_data).in(pounds).amount).toBeCloseTo(110.231);
    });
});

describe("Test lift tonage metric", () => {
    it('Works on empty array', () => {
        const lift_data: LiftData[] = []
        expect(total_tonage(lift_data).amount).toEqual(0);
    });

    it('Works with mixed units', () => {
        const lift_data: LiftData[] = [
            {
                date: new Date(),
                reps: [],
                title: "",
                duration: minutes(10),
                type: "lift"
            },
            {
                date: new Date(),
                reps: [
                    {
                        exercise: Exercise.Squat,
                        reps: 5,
                        weight: pounds(50)
                    },
                    {
                        exercise: Exercise.Bench,
                        reps: 5,
                        weight: kilograms(20)
                    }
                ],
                title: "",
                duration: minutes(10),
                type: "lift"
            }
        ]
        expect(total_tonage(lift_data).in(pounds).amount).toBeCloseTo(470.462262);
    });
});

describe("Test fatigue", ()=> {
    it('Works on no data', () => {
        const data: PainLogData = {
            date: new Date(),
            type: "pain",
            pains: [],
        }
        expect(fatigue(data)).toEqual(unitless(0))
    })

    it('Works on basic data', ()=>{
        const data: PainLogData = {
            date: new Date(),
            type: "pain",
            pains: [
                {
                    pain: 1,
                    description: "",
                    location: new BodyLocationWithSide(UpperBack, Side.NoSide)
                },
                {
                    pain: 2,
                    description: "",
                    location: new BodyLocationWithSide(LowerBack, Side.NoSide)
                },
                {
                    pain: 1,
                    description: "",
                    location: new BodyLocationWithSide(Calf, Side.Right)
                }
            ],
        }
        expect(fatigue(data)).toEqual(unitless(4))
    })
})

function make_run_data(distance: Length, time: Time, workout?: RunningWorkoutData): RunData {
    return {
        date: new Date(),
        distance: distance,
        moving_time: time,
        title: "Run",
        type: "run",
        notes: '',
        workout: workout
    }
}

describe("Test fastest pace", () => {
    it('Works with no workout data', ()=>{
        const data: RunData[] = [
            make_run_data(miles(10), minutes(60)),
            make_run_data(miles(1), minutes(8)),
        ]
        expect(fastest_pace(data).in(minutes_per_mile).amount).toBeCloseTo(6)
    })

    it('Works with intervals', ()=>{
        const data: RunData[] = [
            make_run_data(miles(10), minutes(60)),
            make_run_data(miles(1), minutes(8), {
                intervals: [
                    {
                        distance: meters(100),
                        duration: seconds(10)
                    },
                    {},
                    {
                        distance: meters(100),
                    }, 
                    {
                        duration: seconds(10)
                    }
                ]
            }),
        ]
        expect(fastest_pace(data).in(seconds_per_meter).amount).toBeCloseTo(0.1)
    });
})
