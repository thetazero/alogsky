import { useState } from 'react'
import './App.css'
import { Miles, RunData, Minutes } from './types';
import Run from './activities/Run';

function App() {
    const [run, setRun] = useState<RunData>({
        title: "First Run",
        notes: "This was my first run",
        distance: 3 as Miles,
        duration: 30 as Minutes,
    });

  return (
    <>
      <h1>Training Log</h1>
      <Run data={run} />
    </>
  )
}

export default App
