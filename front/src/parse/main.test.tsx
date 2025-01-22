import { kilograms } from "@buge/ts-units/mass";
import { Exercise, LiftData, PainLogData, pounds } from "../types";
import parse, { data_if_in_parens, extract_paren_data, natural_reps_parse, parse_body_location, parse_unit, parse_units } from "./main";
import { BodyLocationWithoutSide, Side } from "../pt/body_location";
import { meters } from "@buge/ts-units/length";

describe("Test parse unit", () => {
    it('Should parse kg', () => {
        const with_space = "8 kg"
        let parsed = parse_unit(with_space)
        expect(parsed.in(kilograms).amount).toEqual(8)

        const without_space = "8kg"
        parsed = parse_unit(without_space)
        expect(parsed.in(kilograms).amount).toEqual(8)

        const decimal = "8.5kg"
        parsed = parse_unit(decimal)
        expect(parsed.in(kilograms).amount).toEqual(8.5)
    })

    it('Should parse 0', () => {
        let zero = "  0"
        let parsed = parse_unit(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)

        zero = "0"
        parsed = parse_unit(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)

        zero = "  0.   "
        parsed = parse_unit(zero)
        expect(parsed.in(kilograms).amount).toEqual(0)
    })

    it('Should parse seconds', () => {
        const seconds = "8s"
        const parsed = parse_unit(seconds)
        expect(parsed.amount).toEqual(8)
    })

    it('Should parse meters', () => {
        const meters = "8m"
        const parsed = parse_unit(meters)
        expect(parsed.amount).toEqual(8)
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
        const lift: LiftData = res[0] as LiftData
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

describe("parse body location", () => {
    it('Should parse body location with side', () => {
        const location = "Left Foot Metatarsals"
        const parsed = parse_body_location(location)
        expect(parsed.length).toEqual(1)
        expect(parsed[0].location).toEqual("Foot Metatarsals")
        expect(parsed[0].side).toEqual(Side.Left)
    })

    it('Should parse body location without side', () => {
        const location = "calf"
        const parsed = parse_body_location(location)
        expect(parsed.length).toEqual(1)
        expect(parsed[0].location).toEqual(BodyLocationWithoutSide.Calf)
        expect(parsed[0].side).toEqual(Side.NoSide)
    })

    it('Should parse body location with both sides', ()=>{
        const location = "both feet"
        const parsed = parse_body_location(location)
        expect(parsed.length).toEqual(2)
        expect(parsed[0].location).toEqual(BodyLocationWithoutSide.Foot)
    })
})

// todo: test stuff like overhead press: 8x6kg, 8x8kg, 8x8kg
describe("natural reps parse", () => {
    it("Works in basic cases", () => {
        const example = "overhead press: 8x6kg, 8x8kg, 8x8kg"
        const parsed = natural_reps_parse(example)
        expect(parsed).toHaveLength(3)
        expect(parsed[0].reps).toEqual(8)
        expect(parsed[0].weight.in(kilograms).amount).toEqual(6)
    })

    it("Works when a rep is empty", () => {
        let text = "overhead press: 8x6kg,"
        let parsed = natural_reps_parse(text)
        expect(parsed).toHaveLength(1)

        text = "overhead press: "
        parsed = natural_reps_parse(text)
        expect(parsed).toHaveLength(0)
    })

    it("Works for multi unit exercises", () => {
        let text = "farmer cary: 2x(24lbs|15meters)"
        let parsed = natural_reps_parse(text)
        expect(parsed).toHaveLength(1)
        expect(parsed[0].reps).toEqual(2)
        expect(parsed[0].weight).toEqual(pounds(24))
        expect(parsed[0].length).toEqual(meters(15))
        expect(parsed[0].time).toEqual(undefined)

    })

    it('Works for duplicate sets', () => {
        const parsed = natural_reps_parse("bicep curl: 3x8x40lbs, 12x50lbs")
        expect(parsed).toHaveLength(4)
        expect(parsed[0].reps).toEqual(8)
        expect(parsed[0].weight.in(pounds).amount).toEqual(40)
        expect(parsed[1].reps).toEqual(8)
        expect(parsed[3].reps).toEqual(12)
        expect(parsed[3].weight.in(pounds).amount).toEqual(50)
    })
})

describe("Should throw an error if there on incorrectly duplicate data", () => {
    it("Throws if there is multiple sleep data for a day", () => {
        const data = [
            {
                "version": 1,
                "type": "sleep",
                "date": "Jan 2, 2024, 7:50:00 AM",
                "data": {
                    "duration": 8 * 60,
                }
            },
            {
                "version": 1,
                "type": "sleep",
                "date": "Jan 2, 2024, 9:50:00 AM",
                "data": {
                    "duration": 8 * 60,
                }
            }
        ]
        const [parsed_data, errors] = parse(data)
        expect(parsed_data).toHaveLength(1)
        expect(errors).toEqual(["Duplicate sleep log on 2024-1-2"])
    });
})

describe("Parse pain v2", () => {
    it("Should parse in basic case", () => {
        const data = {
            "version": 2,
            "type": "pain",
            "date": "Jan 2, 2024, 7:50:00 AM",
            "data": [
                {
                    "description": "Pain during run",
                    "snapshots": [
                        "lower back (1)",
                        "left knee (1)",
                        "upper back (1)",
                    ]
                },
                {
                    "description": "Started hurting 7 miles in after picking up the pace to catch up",
                    "snapshots": [
                        "right achilles (3)",
                    ]
                },
                {
                    "description": "Pain during core",
                    "snapshots": [
                        "right hip flexor (2)",
                    ]
                }
            ]
        }

        const [parsed_data, errors] = parse([data])
        expect(errors).toEqual([])
        expect(parsed_data).toHaveLength(1)
        const pain: PainLogData = parsed_data[0] as PainLogData
        expect(pain.type).toBe("pain")
        expect(pain.pains).toHaveLength(5)
        const snapshot_4 = pain.pains[3]
        expect(snapshot_4.description).toEqual("Started hurting 7 miles in after picking up the pace to catch up")
        expect(snapshot_4.location.location).toEqual(BodyLocationWithoutSide.AchillesTendon)
        expect(snapshot_4.location.side).toEqual(Side.Right)
        expect(snapshot_4.pain).toEqual(3)
    })
})

describe("extract paren data", () => {
    it('Should work with one paren pair', () => {
        const data = "right hip flexor (2)"
        const [description, pain] = extract_paren_data(data)
        expect(description).toEqual("right hip flexor")
        expect(pain).toEqual("2")
    })

    it('Should work with no paren pair', () => {
        const data = "right hip flexor"
        const [description, pain] = extract_paren_data(data)
        expect(description).toEqual("right hip flexor")
        expect(pain).toEqual("")
    })
})

describe("data if in parens", () => {
    it('Should work with one paren pair', () => {
        const data = "(2)"
        const res = data_if_in_parens(data)
        expect(res).toEqual("2")
    })

    it('Should work with no paren pair', () => {
        const data = "2"
        const res = data_if_in_parens(data)
        expect(res).toEqual(null)
    })

    it('Should work on empty string', () => {
        expect(data_if_in_parens("")).toEqual(null)
    })

    it('Should work on undefined and null', () => {
        expect(data_if_in_parens(undefined)).toEqual(null)
        expect(data_if_in_parens(null)).toEqual(null)
    })
})

describe("parse units", () => {
    it('Should work on a single unit', () => {
        expect(parse_units("5lbs")).toEqual([pounds(5)])
    })

    it('Should work on multiple units', () => {
        expect(parse_units("(5lbs|10kg)")).toEqual([pounds(5), kilograms(10)])
    })

    it('Should work on multiple units and spaces', () => {
        expect(parse_units("(  5 lbs|    10kg)")).toEqual([pounds(5), kilograms(10)])
    })
})
