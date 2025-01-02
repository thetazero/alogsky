import { kilograms } from "@buge/ts-units/mass";
import { Exercise, LiftData } from "../types";
import parse, { parse_weight } from "./main";

describe("Test parse weigth", () => {
    it('Should parse kg', () => {
        const with_space = "8 kg"
        let parsed = parse_weight(with_space)
        expect(parsed.in(kilograms).amount).toEqual(8)

        const without_space = "8kg"
        parsed = parse_weight(without_space)
        expect(parsed.in(kilograms).amount).toEqual(8)

        const decimal = "8.5kg"
        parsed = parse_weight(decimal)
        expect(parsed.in(kilograms).amount).toEqual(8.5)
    })

    it('Should parse 0', () => {
        let zero = "  0"
        let parsed = parse_weight(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)

        zero = "0"
        parsed = parse_weight(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)

        zero = "  0.   "
        parsed = parse_weight(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)
    })
});


describe("Test parse lift v2", () => {
    it('Should parse', () => {
        const data = {
            "version": 2,
            "type": "lift",
            "date": "Jan 2, 2024, 7:50:00 AM",
            "data": {
                "duration": 35,
                "notes": "Decided to lift instead of run due to plantar pain, tweaked right glute a tiny bit",
                "exercises": [
                    "bicep curl: 6x3kg, 8x7kg, 8x8kg, 8x8kg",
                    "lateral raise: 8x3kg, 8x5kg, 8x6kg",
                    "Bulgarian split squat: 8x8kg, 8x8kg, 8x8kg",
                    "single leg calf raise: 20, 20, 20",
                    "overhead press: 8x6kg, 8x8kg, 8x8kg",
                    "rows: 8x8kg, 8x8kg",
                    {
                        "exercise": "Bench",
                        "reps": [8, 8],
                        "weight": ["8 kg", "8kg"]
                    },
                    {
                        "exercise": "Bicep Curl",
                        "reps": 8,
                        "weight": "8 kg"
                    }
                ]
            }
        }
        const [res, errors] = parse([data])
        const lift: LiftData = res[0]
        expect(errors).toEqual([])
        expect(lift).not.toEqual(undefined)
        expect(lift.reps).toHaveLength(21)
        expect(lift.reps[10].exercise).toEqual(Exercise.SingleLegCalfRaise)
        expect(lift.reps[10].reps).toEqual(20)
        expect(lift.reps[10].weight.amount).toEqual(0)
        expect(lift.reps[2].weight.in(kilograms).amount).toEqual(8)
        expect(lift.reps[2].reps).toEqual(8)
        expect(lift.reps[19].reps).toEqual(8)
        expect(lift.reps[19].exercise).toEqual(Exercise.Bench)
        expect(lift.reps[20].reps).toEqual(8)
        expect(lift.reps[20].exercise).toEqual(Exercise.BicepCurl)
    })
});