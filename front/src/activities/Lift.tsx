import React, { useEffect, useState } from "react";
import { Exercise, LiftData, RepData, tons } from "../types";
import { lift_tonage, rep_tonage } from "../analysis/metrics";
import Activity from "../components/Activity";
import ScrollableTable from "../components/Table";
import { fmt_quantity, fmt_rep, nice_number } from "../utils/format";

export interface LiftProps {
    data: LiftData;
    height: number;
}

function group_by_exercise(data: LiftData): Map<Exercise, RepData[]> {
    const cache: Map<Exercise, RepData[]> = new Map();
    for (const rep of data.reps) {
        const cur = cache.get(rep.exercise) ?? [];
        cur.push(rep);
        cache.set(rep.exercise, cur);
    }
    return cache;
}

function to_table(data: Map<Exercise, RepData[]>): string[][] {
    const rows: RepData[][] = Array.from(data.values());
    const unnorm: string[][] = rows.map((row) => row.map(fmt_rep));
    const max_length = Math.max(...unnorm.map((row) => row.length));
    unnorm.map((row) => {
        const missing = max_length - row.length;
        return row.concat(new Array(missing).fill(""));
    });
    // add exercise name to the beginning of each row
    const exercises = Array.from(data.keys());
    return unnorm.map((row, i) => {
        const tonage = data.get(exercises[i])?.map(rep_tonage).reduce((a, b) => a.plus(b), tons(0)) ?? tons(0);
        const name = `${exercises[i]} (${fmt_quantity(tonage.in(tons))})`;
        return [name, ...row];
    });
}

export const lift_const_pixels = 81;

export function lift_estimate_height_px(data: LiftData): number {
    const exercises = new Set(data.reps.map((rep) => rep.exercise)).size;
    return lift_const_pixels + exercises * 36.2;
}

const Lift: React.FC<LiftProps> = ({ data, height }) => {
    const [table, setTable] = useState<string[][]>([]);

    useEffect(() => {
        setTable(to_table(group_by_exercise(data)));
    }, [data]);

    return (
        <Activity date={data.date} height={height} title="Lift">
            <div className="mb-4">
                <span className="font-semibold emph mb-4">Tonage: </span> {nice_number(lift_tonage(data).in(tons).amount)} tons
            </div>
            <ScrollableTable table={table} />
        </Activity>
    );
};

export default Lift;
