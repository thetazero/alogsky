import { useEffect, useState } from 'react'
import data from "./data/log.json"
// import strava_data from "./data/strava_neltoid.json"
import strava_data from "./data/strava_export.json"
import parse from './parse/main';
import { TrainingData } from './types';
import SingleMetricChart from './charts/MetricChart';
import Tile from './components/Tile';
import WeekOverview from './tiles/WeekOverview';
import Analysis from './analysis/analysis'
import TrainingLogTile from './tiles/TrainingLogTile';
import MonthCalendar from './components/MonthCalendar';

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
    }, [data]);

    useEffect(() => {
        setAnalysis(new Analysis(processed))
    }, [processed]);

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))] gap-5 p-4 mx-auto">
                <Tile title='Single Metric Chart'>
                    <SingleMetricChart analysis={analysis} />
                </Tile>
                <Tile title="Training Log">
                    <TrainingLogTile analysis={analysis} />
                </Tile>
                <Tile title="Weekly Overview">
                    <WeekOverview analysis={analysis} />
                </Tile>
                <Tile title="Calendar Test">
                    <MonthCalendar date={new Date()}/>
                </Tile>
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
            </div>
        </>
    )
}

export default App
