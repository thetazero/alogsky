import { meters, miles } from "@buge/ts-units/length";
import { Metric, RunData } from "../types";
import Analysis from "./analysis";
import { minutes, seconds } from "@buge/ts-units/time";

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

    it('Should report the correct total miles for a week', () => {
        const run_data: RunData = {
            date: new Date(2024, 11, 27),
            distance: meters(11002.0),
            moving_time: seconds(2908.0),
            type: "run",
            notes: "",
            title: ""
        }
        const analysis = new Analysis([run_data]);
        expect(analysis.total_mileage().in(miles).amount).toBeCloseTo(6.8363259)
        expect(analysis.get_metric(Metric.Mileage)).toBeCloseTo(6.8363259)
    });
});
