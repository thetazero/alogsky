import { get_week_start } from "./time";

describe("Test time utilities", () => {
    it('Should say monday is the first day of the week', () => {
        const day = new Date("2025-01-02")
        const week_start = get_week_start(day)
        expect(week_start.getDay()).toEqual(1);
    });
});
