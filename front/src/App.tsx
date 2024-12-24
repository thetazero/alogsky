import { useEffect, useState } from 'react'
import './App.css'
import './Tile.css'
import Run from './activities/Run';
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import process, { ActivityData } from './process/main';
import { LiftData, RunData } from './types';
import SingleMetricChart from './charts/MetricChart';
import Tile from './components/Tile';
import TrainingLog from './components/TrainingLog';
import Lift from './activities/Lift';

function App() {
    const [processed, setProcessed] = useState<ActivityData[]>([]);
    const [runs, setRuns] = useState<RunData[]>([]);
    const [lifts, setLifts] = useState<LiftData[]>([]);

    useEffect(() => {
        const manual = process(data)
        const strava = process(strava_data)
        const all = [...manual, ...strava]
        all.sort((a, b) => b.date.getTime() - a.date.getTime())
        setProcessed(all)
    }, [data]);

    useEffect(() => {
        setRuns(processed.filter((activity) => activity.type === "run"))
        setLifts(processed.filter((activity) => activity.type === "lift"))
    }, [processed]);

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))] gap-5 p-4 mx-auto bg-gray-900 rounded-lg">
                <Tile title='Single Metric Chart'>
                    <SingleMetricChart runs={runs} />
                </Tile>
                <Tile title="Training Log">
                    <TrainingLog processed={runs} />
                </Tile>
                <Tile title="Lifting Overview">
                    {
                        lifts.map((lift, i) => (
                            <Lift key={i} data={lift} />
                        ))
                    }
                </Tile>
            </div>
            <div>
                {JSON.stringify(data)}
            </div>
        </>
    )
}

export default App
