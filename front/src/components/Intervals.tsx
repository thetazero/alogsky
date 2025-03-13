import React from "react";
import { Interval } from "../types";
import { fmt_quantity } from "../utils/format";

export interface IntervalsProps {
    intervals: Interval[];
}

const Intervals: React.FC<IntervalsProps> = ({ intervals }) => {
    return (
        <>
            {
                intervals.map((interval) => {
                    return (
                        <div className="p-2 shadow-md text-center level-2 card">
                            <div className="font-semibold text-lg text-indigo-400">
                                {
                                    interval.distance ? fmt_quantity(interval.distance) : ''
                                }
                            </div>
                            <div className="text-gray-500 text-xs">{
                                interval.duration ? fmt_quantity(interval.duration) : ''
                            }</div>
                        </div>
                    );
                })
            }
        </>
    );
};

export default Intervals;
