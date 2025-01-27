import React, { useEffect, useState } from "react";
import { PainLogData } from "../types";
import Activity from "../components/Activity";
import { fatigue, fatigue_by_region } from "../analysis/metrics";
import { fmt_quantity } from "../utils/format";

interface PainProps {
    data: PainLogData;
    height: number;  // Fixed height for each run
    style?: React.CSSProperties;  // Allow passing style as a prop
}

const PainCard: React.FC<PainProps> = ({
    data,
    height,
}: PainProps) => {
    const fatigue_score = fatigue(data);
    const [regionString, setRegionString] = useState("");

    useEffect(() => {
        const by_region = fatigue_by_region(data)
        setRegionString(
            (Array.from(by_region.entries())).map(data => {
                return `${data[0]}: ${data[1]}`
            }).join(" ")
        )
    }, [data])

    return (
        <Activity title={"Injury Data"} date={data.date} height={height}>
            Fatigue Score: {fmt_quantity(fatigue_score)}
            <br/>
            {
                regionString
            }
        </Activity>
    );
};


export default PainCard;
