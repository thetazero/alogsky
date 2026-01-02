import { TrainingData, Metric } from '../types'
import { TrainingDataSet, get_unit_for_metric } from '../analysis/analysis'
import Analysis from '../analysis/analysis'
import { fmt_quantity } from '../utils/format'
import { Dimensions, Quantity, Unit } from '@buge/ts-units'

interface Props {
  title: string
  data: TrainingData[]
  previousData?: TrainingData[]
  metrics: Metric[]
}

interface MetricCardProps {
  label: string
  value: Quantity<number, Dimensions> | null
  unit: Unit<number, Dimensions>
  change?: number
}

function MetricCard({ label, value, change }: MetricCardProps) {
  const formattedValue = value !== null ? fmt_quantity(value) : 'N/A'
  const changeColor = change !== undefined && change > 0 ? 'text-green-500' : 'text-red-500'
  const changeIcon = change !== undefined && change > 0 ? '↑' : '↓'

  return (
    <div className="level-2 card p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-bold mt-1 text-white">{formattedValue}</div>
      {change !== undefined && (
        <div className={`text-sm mt-1 ${changeColor} font-semibold`}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}% {changeIcon}
        </div>
      )}
    </div>
  )
}

export function SegmentStats({ title, data, previousData, metrics }: Props) {
  const dataset = new TrainingDataSet(data)
  const analysis = new Analysis(dataset)
  const previousAnalysis = previousData ? new Analysis(new TrainingDataSet(previousData)) : null

  return (
    <div className="level-1 card p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map(metric => {
          const value = analysis.get_metric(metric)
          const unit = get_unit_for_metric(metric)

          let change: number | undefined
          if (previousAnalysis && value !== null) {
            const previousValue = previousAnalysis.get_metric(metric)
            if (previousValue !== null && previousValue.value() !== 0) {
              change = ((value.value() - previousValue.value()) / previousValue.value()) * 100
            }
          }

          return (
            <MetricCard
              key={metric}
              label={metric}
              value={value}
              unit={unit}
              change={change}
            />
          )
        })}
      </div>
    </div>
  )
}
