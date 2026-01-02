import { useMemo, useState } from 'react'
import { TrainingDataSet, get_unit_for_metric } from '../analysis/analysis'
import Analysis from '../analysis/analysis'
import { DurationSelector, GroupByDuration } from '../components/DurationSelector'
import { SegmentStats } from '../components/SegmentStats'
import { splitDataByPeriod, getPeriodLabel } from '../analysis/periods'
import SelectMultiple from '../components/SelectMultiple'
import { Metric } from '../types'
import BarChart, { BarChartDataSet } from '../charts/BarChart'

interface Props {
  dataset: TrainingDataSet
  parseErrors: string[]
}

export function OverviewPage({ dataset, parseErrors }: Props) {
  const [duration, setDuration] = useState(GroupByDuration.OneMonth)
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([
    Metric.Mileage,
  ])

  // Fixed metrics for period stats
  const periodMetrics = [
    Metric.Mileage,
    Metric.TrainingHeartBeats,
    Metric.Tonage
  ]

  const periodData = useMemo(() => {
    return splitDataByPeriod(dataset, duration)
  }, [dataset, duration])

  const historicalBarData: BarChartDataSet = useMemo(() => {
    const labels = periodData.map(period => getPeriodLabel(period.data, duration))

    const datasets = selectedMetrics.map(metric => {
      const data = periodData.map(period => {
        const analysis = new Analysis(new TrainingDataSet(period.data))
        return analysis.get_metric(metric)
      })

      return {
        label: metric,
        data,
        unit: get_unit_for_metric(metric)
      }
    })

    return { labels, datasets }
  }, [periodData,  selectedMetrics])

  return (
    <div className="p-6 space-y-6">
      {/* Header with duration selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <DurationSelector value={duration} onChange={setDuration} />
      </div>

      {/* Parse Errors (if any) */}
      {parseErrors.length > 0 && (
        <div className="level-1 card p-4 border border-red-500">
          <h3 className="text-red-500 font-semibold mb-2">Parse Errors</h3>
          <ul className="list-disc list-inside space-y-1">
            {parseErrors.map((error, i) => (
              <li key={i} className="text-sm text-gray-300">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Period Stats */}
      <SegmentStats
        title="Current Period (In Progress)"
        data={periodData.length > 0 ? periodData[periodData.length - 1].data : []}
        previousData={periodData.length > 1 ? periodData[periodData.length - 2].data : []}
        metrics={periodMetrics}
      />

      {/* Previous Period Stats */}
      {periodData.length > 2 ? (
        <SegmentStats
          title="Previous Period"
          data={periodData[periodData.length - 2].data}
          previousData={periodData[periodData.length-3].data}
          metrics={periodMetrics}
        />
      ) : (
        <div className="level-1 card p-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Previous Period</h2>
          <p className="text-gray-400">Not enough data for previous period</p>
        </div>
      )}

      {/* Historical Chart */}
      <div className="level-1 card p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Historical Metrics</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Select Metrics</label>
          <SelectMultiple
            options={Object.values(Metric)}
            selected={selectedMetrics}
            onChange={setSelectedMetrics}
            renderOption={(metric) => metric}
            getOptionKey={(metric) => metric}
          />
        </div>
        <div className="mt-4">
          <BarChart data_set={historicalBarData} title="Historical Metrics" />
        </div>
      </div>
    </div>
  )
}
