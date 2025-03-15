import { meters, miles } from "@buge/ts-units/length";
import { Metric, RunData, TrainingData } from "../types";
import Analysis, { TrainingDataSet } from "./analysis";
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
        const dataset = new TrainingDataSet([
            run_data
        ]);
        const [start, end] = dataset.date_range_for_week(0);
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
        const dataset = new TrainingDataSet([run_data]);
        const analysis = new Analysis(dataset);
        expect(analysis.total_mileage().in(miles).amount).toBeCloseTo(6.8363259)
        expect(analysis.get_metric(Metric.Mileage).in(miles).amount).toBeCloseTo(6.8363259)
    });
});

function make_run_data(date: Date, miles_run?: number, moving_time?: number): RunData {
    return {
        date: date,
        distance: miles(miles_run || 0),
        moving_time: minutes(moving_time || 0),
        type: "run",
        notes: "",
        title: ""
    }
}

const example_dataset_1: TrainingData[] = [
    make_run_data(new Date(2024, 11, 27), 5, 30),
    make_run_data(new Date(2024, 11, 28), 7, 30),
    make_run_data(new Date(2024, 11, 30), 8, 60)
]

const long_dataset: TrainingData[] = [
    make_run_data(new Date(2024, 11, 27), 5, 30),
    make_run_data(new Date(2025, 1, 27), 7, 30),
    make_run_data(new Date(2025, 1, 28), 7, 30),
    make_run_data(new Date(2025, 3, 28), 7, 30),
]

describe("Test training data set", () => {
    it('Should report the correct first and last activity date', () => {
        const dataset = new TrainingDataSet(example_dataset_1);
        expect(dataset._first_activity).toEqual(new Date(2024, 11, 27));
        expect(dataset._last_activity).toEqual(new Date(2024, 11, 30));
    });

    it('Should report the correct number of weeks', () => {
        expect(new TrainingDataSet(example_dataset_1).number_of_weeks()).toBe(1);
    });

    it('Should correctly get data for a week', () => {
        const dataset = new TrainingDataSet(long_dataset);
        const week_0_data = dataset.analysis_for_week(0);
        expect(week_0_data).not.toBeNull();
        expect(week_0_data.dataset.runs.length).toBe(1);

        const week_1_data = dataset.analysis_for_week(1);
        expect(week_1_data.dataset).toEqual(new TrainingDataSet([]));

        const week_9_data = dataset.analysis_for_week(9);
        expect(week_9_data).not.toBeNull();
        expect(week_9_data.dataset.runs.length).toBe(2);
    });

    it('Defines week boundaries correctly', () => {
        const data = [
            make_run_data(new Date(2025, 0, 13, 0, 0, 0, 0)),
            make_run_data(new Date(2025, 0, 19, 23, 59, 59, 999)),
        ]
        const dataset = new TrainingDataSet(data);
        expect(dataset.number_of_weeks()).toBe(1);
    });

    it('Computes the correct date ranges for weeks', () => {
        const dataset = new TrainingDataSet(long_dataset);
        expect(dataset.date_range_for_week(0)).toEqual([
            new Date(2024, 11, 23, 0, 0, 0, 0),
            new Date(2024, 11, 29, 23, 59, 59, 999)
        ]);
    });

    it('Orders data correctly', ()=> {
        const dataset= new TrainingDataSet([
            make_run_data(new Date(2024, 11, 28, 1)),
            make_run_data(new Date(2024, 11, 27, 12)),
            make_run_data(new Date(2024, 11, 27, 5)),
            make_run_data(new Date(2024, 11, 27, 17)),
            make_run_data(new Date(2024, 11, 27, 8)),
        ]);
        console.log(dataset.data.map(d => d.date.getHours()));
        expect(dataset.data.map(d => d.date.getHours())).toEqual([5, 8, 12, 17, 1]);
    });
})
