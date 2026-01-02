import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import parse from './parse/main';
import { TrainingData } from './types';
import { TrainingDataSet } from './analysis/analysis'
import { NavBar } from './components/NavBar'
import { LegacyPage } from './pages/LegacyPage'
import { OverviewPage } from './pages/OverviewPage'

function App() {
    const [processed, setProcessed] = useState<TrainingData[]>([]);
    const [dataset, setDataset] = useState<TrainingDataSet>(new TrainingDataSet([]));
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
        setDataset(new TrainingDataSet(processed))
    }, [processed]);

    return (
        <BrowserRouter>
            <div className="min-h-screen">
                <NavBar />
                <div className="pt-14">
                    <Routes>
                        <Route path="/" element={<LegacyPage dataset={dataset} parseErrors={errors} />} />
                        <Route path="/new" element={<OverviewPage dataset={dataset} parseErrors={errors} />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
