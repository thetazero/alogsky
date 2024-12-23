import { useEffect, useState } from 'react'
import './App.css'
import './Tile.css'
import Run from './activities/Run';
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import process from './process/main';
import { RunData } from './types';
import SingleMetricChart from './charts/MetricChart';
import Tile from './components/Tile';

function App() {
    const [processed, setProcessed] = useState<RunData[]>([]);

    useEffect(() => {
        const manual = process(data)
        const strava = process(strava_data)
        const all = [...manual, ...strava]
        all.sort((a, b) => b.date.getTime() - a.date.getTime())
        setProcessed(all)
    }, [data]);

    return (
        <>
            <h1>Training Log</h1>
            <SingleMetricChart runs={processed} />
            <div

                style={
                    {
                        textAlign: "center",
                    }
                }
            >
                <div className="tile-grid">
                    {processed.slice(0, 10).map((run, i) => (
                        <Tile key={i} title={run.title}>
                            <Run data={run} />
                        </Tile>
                    ))}
                </div>
            </div>
            <div>
                {JSON.stringify(data)}
            </div>
        </>
    )
}

export default App
