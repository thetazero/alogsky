import React, { useEffect, useState } from "react";
import { Exercise, LiftData, RepData } from "../types";

export interface LiftProps {
    data: LiftData;
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

const Lift: React.FC<LiftProps> = ({ data }) => {
    const [table, setTable] = useState<string[][]>([]);

    useEffect(() => {
        setTable(to_table(group_by_exercise(data)));
    }, [data]);

    return (
        <div className="space-y-6 p-6 dark:border-gray-500 bg-gray-900 dark:bg-gray-800">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{data.title}</h2>
                <span className="text-sm text-gray-400">
                    {data.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>
            <div className="text-lg font-semibold text-gray-300">
                <div className="overflow-x-auto">
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
        </div>
    );
};

export default Lift;
