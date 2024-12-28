import { miles } from "@buge/ts-units/length";
import { RunData } from "../types";
import Analysis from "./analysis";
import { minutes } from "@buge/ts-units/time";

describe("Test Analysis class", () => {
    it('Should give a valid date range for a week', () => {
        const run_data: RunData = {
            date: new Date(2024, 11, 27),
            distance: miles(5),
            moving_time: minutes(30),
            type: "run",
            notes: "",
            title: ""
        }
        const analysis = new Analysis([
            run_data
        ]);
        const [start, end] = analysis.date_range_for_week(0);
        expect(start).toEqual(new Date(2024, 11, 23));
        expect(end).toEqual(new Date(2024, 11, 29, 23, 59, 59, 999));
    });
});
