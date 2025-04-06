import { makeQuantity } from "@buge/ts-units";
import { miles, meters } from "@buge/ts-units/length";
import { minutes, seconds } from "@buge/ts-units/time";
import { fmt_minutes_per_mile, fmt_rep } from "./format";
import { Exercise, pounds } from "../types";

describe("Test miles per minute formatting", () => {
    it('Should format correctly for same units', () => {
        let inverse_speed = makeQuantity(1, minutes.per(miles));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("1:00/mile");
        inverse_speed = makeQuantity(1.5, minutes.per(miles));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("1:30/mile");
    });

    it('Should format correctly for different units', () => {
        const inverse_speed = makeQuantity(1 / 6.7056, seconds.per(meters));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("4:00/mile");
    });
});

describe("Format rep", () => {
    it('Should format weighted rep correctly', () => {
        expect(fmt_rep({ reps: 5, weight: makeQuantity(100, pounds), exercise: Exercise.Squat })).toEqual("5 x 100lbs");
    });

    it('Should format unweighted rep correctly', () => {
        expect(fmt_rep({ reps: 5, weight: makeQuantity(0, pounds), exercise: Exercise.Squat })).toEqual("5");
    });

    it('Should format rep with time correctly', () => {
        expect(fmt_rep({ reps: 5, weight: makeQuantity(0, pounds), time: makeQuantity(30, seconds), exercise: Exercise.Squat })).toEqual("5 x 30s");
    });
});
