import { minutes } from "@buge/ts-units/time";
import { Exercise, LiftData, PainLogData, pounds, RepData, Side, unitless } from "../types";
import { fatigue, rep_tonage, total_tonage } from "./metrics";
import { kilograms } from "@buge/ts-units/mass";
import { BodyLocationWithSide, Calf, LowerBack, UpperBack } from "../pt/body_location";

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
