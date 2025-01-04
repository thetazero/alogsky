import { minutes } from "@buge/ts-units/time";
import { Exercise, LiftData, pounds, RepData } from "../types";
import { rep_tonage, total_tonage } from "./metrics";
import { kilograms } from "@buge/ts-units/mass";

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
