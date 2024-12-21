import { useEffect, useState } from 'react'
import './App.css'
import Run from './activities/Run';
import data from "./data/log.json"
import process from './process/main';
import { RunData } from './types';

function App() {
    const [processed, setProcessed] = useState<RunData[]>([]);

    useEffect(() => {
        setProcessed(process(data))
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
                {processed.map((run, i) => (
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
