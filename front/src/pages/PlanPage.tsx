import { DayColumn } from "../components/DayColumn";
import { TrainingData, Exercise, pounds, tons, RunData, LiftData } from "../types";
import { get_week_start, get_day_string } from "../utils/time";
import { miles } from "@buge/ts-units/length";
import { minutes } from "@buge/ts-units/time";
import { total_mileage, total_tonage, training_heart_beats } from "../analysis/metrics";
import { nice_number } from "../utils/format";
import Chip from "../components/Chip";

function createRun(
    distanceMiles: number,
    paceMinPerMile: number,
    date: Date,
    title: string = "Run",
    notes: string = ""
): RunData {
    return {
        title,
        notes,
        distance: miles(distanceMiles),
        moving_time: minutes(distanceMiles * paceMinPerMile),
        date,
        type: "run"
    };
}

// Hardcoded sample training data for the week
const PLAN_DATA: TrainingData[] = [
    createRun(5, 7.5, new Date(2026, 0, 26), "Easy Run"), 
    createRun(6, 7.5, new Date(2026, 0, 28), "Easy Run"), 
    createRun(6, 7.0, new Date(2026, 0, 29), "Easy Run", "workout"),
    // Friday - Easy Run
    createRun(4, 8, new Date(2026, 0, 30), "Recovery Run"),
    createRun(4, 7.75, new Date(2026, 0, 31), "Recovery Run"),
    createRun(6, 7.0, new Date(2026, 1, 1), "Long Run", "Build endurance"),
];

function groupByDay(data: TrainingData[]): Map<string, TrainingData[]> {
    const grouped = new Map<string, TrainingData[]>();
    for (const item of data) {
        const key = get_day_string(item.date);
        const existing = grouped.get(key) || [];
        existing.push(item);
        grouped.set(key, existing);
    }
    return grouped;
}

function getWeekDates(startDate: Date): Date[] {
    const weekStart = get_week_start(startDate);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dates.push(date);
    }
    return dates;
}

interface Props { }

export function PlanPage({ }: Props) {
    const weekDates = getWeekDates(new Date(2026, 0, 27)); // Week of Jan 27, 2026
    const groupedData = groupByDay(PLAN_DATA);

    // Calculate totals for summary row
    const runs = PLAN_DATA.filter((d): d is RunData => d.type === "run");
    const lifts = PLAN_DATA.filter((d): d is LiftData => d.type === "lift");
    const totalMileage = total_mileage(runs).in(miles).amount;
    const totalHeartBeats = training_heart_beats(PLAN_DATA).amount;
    const totalTonnage = total_tonage(lifts).in(tons).amount;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Plan</h1>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekDates.map(date => (
                    <DayColumn
                        key={get_day_string(date)}
                        date={date}
                        data={groupedData.get(get_day_string(date)) || []}
                    />
                ))}
            </div>

            <div className="level-1 card p-4">
                <div className="text-center text-gray-400 text-sm mb-2">Week Total</div>
                <div className="flex justify-center gap-4">
                    <Chip title={nice_number(totalMileage)} subtitle="miles" />
                    <Chip title={nice_number(totalHeartBeats)} subtitle="THB" />
                    <Chip title={nice_number(totalTonnage)} subtitle="tons" />
                </div>
            </div>
        </div>
    )
}
