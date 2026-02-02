import { TrainingData, RunData, LiftData, tons } from "../types";
import { total_mileage, total_tonage, training_heart_beats } from "../analysis/metrics";
import { nice_number } from "../utils/format";
import Chip from "./Chip";
import { miles } from "@buge/ts-units/length";

interface DayColumnProps {
    date: Date;
    data: TrainingData[];
}

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function serializeForDisplay(data: TrainingData[]): object[] {
    return data.map(d => {
        if (d.type === 'run') {
            return {
                type: 'run',
                title: d.title,
                distance: `${d.distance.in(miles).amount.toFixed(2)} mi`,
                notes: d.notes || undefined
            };
        }
        if (d.type === 'lift') {
            return {
                type: 'lift',
                title: d.title,
                exercises: d.reps.length
            };
        }
        if (d.type === 'bike') {
            return {
                type: 'bike',
                title: d.title,
                distance: d.distance ? `${d.distance.in(miles).amount.toFixed(2)} mi` : undefined
            };
        }
        if (d.type === 'kayak') {
            return { type: 'kayak' };
        }
        if (d.type === 'row') {
            return { type: 'row', title: d.title };
        }
        if (d.type === 'elliptical') {
            return { type: 'elliptical', title: d.title };
        }
        if (d.type === 'sleep') {
            return { type: 'sleep' };
        }
        if (d.type === 'pain') {
            return { type: 'pain', count: d.pains.length };
        }
        if (d.type === 'note') {
            return { type: 'note', title: d.title };
        }
        return { type: 'unknown' };
    });
}

export function DayColumn({ date, data }: DayColumnProps) {
    const runs = data.filter((d): d is RunData => d.type === "run");
    const lifts = data.filter((d): d is LiftData => d.type === "lift");

    const mileage = total_mileage(runs).in(miles).amount;
    const heartBeats = training_heart_beats(data).amount;
    const tonnage = total_tonage(lifts).in(tons).amount;

    const weekday = WEEKDAY_NAMES[date.getDay()];
    const month = MONTH_NAMES[date.getMonth()];
    const dayNum = date.getDate();

    return (
        <div className="level-1 card p-2 flex flex-col gap-2">
            <div className="text-center text-white font-bold">
                {weekday} {month} {dayNum}
            </div>

            <div className="flex flex-row gap-1 justify-center">
                <Chip title={nice_number(mileage)} subtitle="miles" />
                <Chip title={nice_number(heartBeats)} subtitle="THB" />
                <Chip title={nice_number(tonnage)} subtitle="tons" />
            </div>

            {data.length > 0 && (
                <div className="level-2 card p-2 mt-2">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(serializeForDisplay(data), null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
