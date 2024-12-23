import { makeQuantity } from "@buge/ts-units";
import { miles, meters } from "@buge/ts-units/length";
import { minutes, seconds } from "@buge/ts-units/time";
import { fmt_minutes_per_mile } from "./format";

describe("Test miles per minute formatting", () => {
    it('Should format correctly for same units', () => {
        let inverse_speed = makeQuantity(1, minutes.per(miles));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("1:00/mile");
        inverse_speed = makeQuantity(1.5, minutes.per(miles));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("1:30/mile");
    });

    it('Should format correctly for different units', () => {
        let inverse_speed = makeQuantity(1 / 6.7056, seconds.per(meters));
        expect(fmt_minutes_per_mile(inverse_speed)).toEqual("4:00/mile");
    });
});
