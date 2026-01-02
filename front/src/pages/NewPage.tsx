import { TrainingDataSet } from '../analysis/analysis'

interface Props {
  dataset: TrainingDataSet
  parseErrors: string[]
}

export function NewPage({ dataset, parseErrors }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">New Interface</h1>

      <div className="bg-level-2 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3 text-white">Dataset Info</h2>
        <div className="space-y-2 text-gray-300">
          <p>Total activities: <span className="font-mono text-blue-400">{dataset.data.length}</span></p>
          <p>Runs: <span className="font-mono text-blue-400">{dataset.runs.length}</span></p>
          <p>Lifts: <span className="font-mono text-blue-400">{dataset.lifts.length}</span></p>
          <p>Sleeps: <span className="font-mono text-blue-400">{dataset.sleeps.length}</span></p>
        </div>
      </div>

      {parseErrors.length > 0 && (
        <div className="bg-level-2 rounded-lg p-6 border border-red-500">
          <h2 className="text-xl font-semibold mb-3 text-red-500">Parse Errors</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {parseErrors.map((error, i) => (
              <li key={i} className="font-mono text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {parseErrors.length === 0 && (
        <div className="bg-level-2 rounded-lg p-6 border border-green-500">
          <p className="text-green-400">✓ No parse errors</p>
        </div>
      )}
    </div>
  )
}
