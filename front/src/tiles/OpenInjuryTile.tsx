import React, { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import { PainData } from "../types";
import { get_first } from "../analysis/utils";
import DateRange from "../components/DateRange";
import InjurySnapshotHorizontalScroller from "../components/InjurySnapshotHorizontalScroller";

export interface OpenInjuryTileProps {
    analysis: Analysis
}

const OpenInjuryTile: React.FC<OpenInjuryTileProps> = ({ analysis }) => {
    const [openInjuryData, setOpenInjuryData] = useState<PainData[]>([]);

    useEffect(() => {
        const injuries = analysis.get_injury_data()
        let open_injuries = injuries.filter(injury => injury.snapshots[injury.snapshots.length - 1].pain >= 1)
        setOpenInjuryData(open_injuries)
    }, [analysis])

    return (
        <>
            {
                openInjuryData.map(injury => {
                    return (
                        <div key={injury.location} className="p-2 rounded-full deemph">
                            {injury.location}:
                            {" "}
                            <DateRange
                                startDate={get_first(injury.snapshots).date}
                                endDate={new Date()}
                            />
                            <hr className="line my-4" />
                            <InjurySnapshotHorizontalScroller
                                snapshots={injury.snapshots}
                            />
                        </div>
                    )
                })
            }
            {
                openInjuryData.length == 0 && (
                    <>
                        No currently open injuries
                    </>
                )
            }
        </>
    )
}

export default OpenInjuryTile
