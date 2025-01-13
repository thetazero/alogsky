import { calendar_days_appart, different_days, get_day_string, get_week_start } from "./time";

describe("Test time utilities", () => {
    it('Should say monday is the first day of the week', () => {
        const day = new Date("2025-01-02")
        const week_start = get_week_start(day)
        expect(week_start.getDay()).toEqual(1);
    });
});

describe("Test different days", () => {
    it('Should say two different days are different', () => {
        const day1 = new Date("2025-01-02")
        const day2 = new Date("2025-01-03")
        expect(different_days(day1, day2)).toBeTruthy();
    })

    it('Should say two same days are not different', () => {
        const day1 = new Date("2025-01-02")
        day1.setHours(1)
        const day2 = new Date("2025-01-02")
        expect(different_days(day1, day2)).toBeFalsy();
    })

    it('Should say same day with different month is different', () => {
        const day1 = new Date("2025-01-02")
        const day2 = new Date("2025-02-02")
        expect(different_days(day1, day2)).toBeTruthy();
    })
});

describe("Test calendar days appart", () => {
    it('Should say two days appart are 2 days appart', () => {
        const day1 = new Date(2025, 1, 1, 8, 8)
        const day2 = new Date(2025, 1, 3, 8, 8)
        const day3 = new Date(2025, 1, 1, 12, 8)
        expect(calendar_days_appart(day1, day2)).toEqual(2);
        expect(calendar_days_appart(day1, day3)).toEqual(0);
    })
})

describe("Test get day string", () => {
    it('Should return the correct string', () => {
        const date = new Date(2025, 1, 1, 8, 8)
        expect(get_day_string(date)).toEqual("2025-2-1");
    })
})
