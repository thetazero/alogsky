import React, { useEffect, useState } from "react";
import { Exercise, LiftData, pounds, RepData } from "../types";
import { lift_tonage } from "../analysis/metrics";
import PrettyDate from "../components/Date";
import Activity from "../components/Activity";

export interface LiftProps {
    data: LiftData;
    height: number;
}

function group_by_exercise(data: LiftData): Map<Exercise, RepData[]> {
    let cache: Map<Exercise, RepData[]> = new Map();
    for (const rep of data.reps) {
        let cur = cache.get(rep.exercise) ?? [];
        cur.push(rep);
        cache.set(rep.exercise, cur);
    }
    return cache;
}

function to_table(data: Map<Exercise, RepData[]>): string[][] {
    const rows: RepData[][] = Array.from(data.values());
    let unnorm: string[][] = rows.map((row) => row.map((rep) => {
        if (rep.weight.amount === 0) return `${rep.reps}`;
        else if (rep.reps === 0) return `${rep.weight.toString()}`;
        else return `${rep.reps} x ${rep.weight.toString()}`
    }));
    let max_length = Math.max(...unnorm.map((row) => row.length));
    unnorm.map((row) => {
        let missing = max_length - row.length;
        return row.concat(new Array(missing).fill(""));
    });
    // add exercise name to the beginning of each row
    return unnorm.map((row, i) => {
        return [Array.from(data.keys())[i], ...row];
    });
}

const Lift: React.FC<LiftProps> = ({ data, height }) => {
    const [table, setTable] = useState<string[][]>([]);

    useEffect(() => {
        setTable(to_table(group_by_exercise(data)));
    }, [data]);

    return (
        <Activity date={data.date} height={height} title="Lift">
            <div className="mb-4">
                <span className="font-semibold emph mb-4">Tonage: </span> {lift_tonage(data).in(pounds).amount.toFixed(0)} lbs
            </div>
            <div className="text-sm">
                <div className="overflow-x-auto overflow-y-scroll"
                    style={
                        {
                            height: height - 120
                        }
                    }
                >
                    <table className="table-auto w-full border-collapse border border-gray-500">
                        <tbody>
                            {table.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="border border-gray-500 px-4 py-2 text-gray-300"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Activity>
    );
};

export default Lift;
