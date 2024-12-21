import { useEffect, useState } from 'react'
import './App.css'
import Run from './activities/Run';
import data from "./data/log.json"
import strava_data from "./data/strava_export.json"
import process from './process/main';
import { RunData } from './types';

function App() {
    const [processed, setProcessed] = useState<RunData[]>([]);

    useEffect(() => {
        const manual = process(data)
        const strava = process(strava_data)
        setProcessed([...manual, ...strava])
    }, [data]);

    return (
        <>
            <h1>Training Log</h1>
            <div

                style={
                    {
                        textAlign: "center",
                    }
                }
            >
                {processed.slice(0, 10).map((run, i) => (
                    <Run key={i} data={run} />
                ))}
            </div>
            <div>
                {JSON.stringify(data)}
            </div>
        </>
    )
}

export default App
