import { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import { PainAtLocationData } from "../types";
import { get_first } from "../analysis/utils";
import DateRange from "../components/DateRange";
import InjurySnapshotHorizontalScroller from "../components/InjurySnapshotHorizontalScroller";
import { calendar_days_appart } from "../utils/time";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";

export interface OpenInjuryTileProps {
    analysis: Analysis
}

const OpenInjuryTile: panelComponentType = ({ analysis, id }) => {
    const [openInjuryData, setOpenInjuryData] = useState<PainAtLocationData[]>([]);

    useEffect(() => {
        const injuries = analysis.get_injury_data()
        const open_injuries = injuries.filter(injury => {
            const last_snapshot = injury.snapshots[injury.snapshots.length - 1]
            const recent_pain = last_snapshot.pain >= 1
            const has_recent_snapshot = calendar_days_appart(last_snapshot.date, new Date()) <= 3
            return recent_pain && has_recent_snapshot
        })
        setOpenInjuryData(open_injuries)
    }, [analysis])

    return (
        <Tile title="Open Injuries" id={id}>
            {
                openInjuryData.map(injury => {
                    return (
                        <div key={injury.location.to_string()} className="p-2 rounded-full deemph">
                            {injury.location.to_string()}:
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
        </Tile>
    )
}

export default OpenInjuryTile
