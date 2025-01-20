import { useEffect, useState } from 'react'
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import parse from './parse/main';
import { TrainingData } from './types';
import OpenInjuryTile from './tiles/OpenInjuryTile';
import Tile from './components/Tile';
import WeekOverview from './tiles/WeekOverview';
import Analysis from './analysis/analysis'
import TrainingLogTile from './tiles/TrainingLogTile';
import TrainingSummaryTile from './tiles/TrainingSummaryTile';
import CommandProvider from './CommandProvider';

function App() {
    const [processed, setProcessed] = useState<TrainingData[]>([]);
    const [analysis, setAnalysis] = useState<Analysis>(new Analysis([]));
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const manual = parse(data)
        const strava = parse(strava_data)
        const all = [...manual[0], ...strava[0]]
        const errors = [...manual[1], ...strava[1]]
        setErrors(errors)
        all.sort((a, b) => b.date.getTime() - a.date.getTime())
        setProcessed(all)
    }, []);

    useEffect(() => {
        setAnalysis(new Analysis(processed))
    }, [processed]);

    return (
        <CommandProvider>
            <TrainingLogTile analysis={analysis} />
            <WeekOverview analysis={analysis} />
            <OpenInjuryTile analysis={analysis} />
            <TrainingSummaryTile analysis={analysis} />
            {
                errors.length && (
                    <Tile title="Parse Errors">
                        {
                            errors.map((err, i) => {
                                return (<p key={i}>Parse Error: {err}</p>)
                            })
                        }
                    </Tile>
                )
            }
        </CommandProvider>
    )
}

export default App
