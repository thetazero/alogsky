import React, { useEffect, useState } from "react";
import { LiftData } from "../types";

export interface LiftProps {
    data: LiftData;
}

const Lift: React.FC<LiftProps> = ({ data: { date, title, reps } }) => {
    return (
        <div className="space-y-6 p-6 dark:border-gray-500 bg-gray-900 dark:bg-gray-800">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <span className="text-sm text-gray-400">
                    {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>
            <div className="text-lg font-semibold text-gray-300">
                {reps.map((rep, i) => (
                    <div key={i}>
                        <p>
                            {rep.reps} x {
                                rep.weight.amount === 0 ?
                                    '' :
                                    rep.weight.toString()
                            } {rep.exercise}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Lift;
