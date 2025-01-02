import React, { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import { InjuryData } from "../types";

export interface OpenInjuryTileProps {
    analysis: Analysis
}

const OpenInjuryTile: React.FC<OpenInjuryTileProps> = ({ analysis }) => {
    const [openInjuryData, setOpenInjuryData] = useState<InjuryData[]>([]);

    useEffect(() => {
        const injuries = analysis.get_injury_data()
        let open_injuries = injuries.filter(injury => injury.snapshots[0].pain >= 1)
        setOpenInjuryData(open_injuries)
    }, [analysis])

    return (
        <>
            {
                openInjuryData.map(injury => {
                    return (
                        <div key={injury.location} className="p-2 rounded-full deemph">
                            {injury.location}
                            {
                                JSON.stringify(injury)
                            }
                        </div>
                    )
                })
            }
        </>
    )
}

export default OpenInjuryTile
