import { useEffect, useState } from 'react'
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import parse from './parse/main';
import { TrainingData } from './types';
import WeekOverview from './tiles/WeekOverview';
import Analysis from './analysis/analysis'
import TrainingLogTile from './tiles/TrainingLogTile';
import TrainingSummaryTile from './tiles/TrainingSummaryTile';
import CommandProvider from './CommandProvider';
import ParticularLiftTile from './tiles/ParticularLiftTile';

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

    const defaultTiles = [
        {
            component: WeekOverview,
            id: "week-overview"
        },
        {
            component: TrainingSummaryTile,
            id: "training-summary"
        },
        {
            component: TrainingLogTile,
            id: "training-log"
        },
        // {
        //     component: OpenInjuryTile,
        //     id: "open-injuries"
        // },
        {
            component: ParticularLiftTile,
            id: "particular-lift"
        }
    ]

    return (
        <>
            <CommandProvider defaultTiles={defaultTiles} parseErrors={errors} analysis={analysis} />
        </>
    )
}

export default App
