import { TrainingData } from '../types'
import { TrainingDataSet } from './analysis'
import { GroupByDuration } from '../components/DurationSelector'

export interface PeriodData {
  start: Date
  end: Date
  data: TrainingData[]
}

export function getPeriodLabel(
  period: TrainingData[],
  duration: GroupByDuration
): string {
  if (period.length === 0) return "No Data"

  // Oldest activity = start of period
  const startDate = period[period.length - 1].date

  switch (duration) {
    case GroupByDuration.OneWeek:
      return startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

    case GroupByDuration.OneMonth:
      return startDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })

    case GroupByDuration.ThreeMonths: {
      const quarter = Math.floor(startDate.getMonth() / 3) + 1
      return `Q${quarter} ${startDate.getFullYear()}`
    }

    case GroupByDuration.SixMonths: {
      const half = startDate.getMonth() < 6 ? 'H1' : 'H2'
      return `${half} ${startDate.getFullYear()}`
    }

    case GroupByDuration.OneYear:
      return startDate.getFullYear().toString()

    default:
      return ''
  }
}


function getNextPeriodStart(date: Date, duration: GroupByDuration): Date {
  const d = new Date(date)

  switch (duration) {
    case GroupByDuration.OneWeek:
      d.setDate(d.getDate() + 7)
      break
    case GroupByDuration.OneMonth:
      d.setMonth(d.getMonth() + 1)
      break
    case GroupByDuration.ThreeMonths:
      d.setMonth(d.getMonth() + 3)
      break
    case GroupByDuration.SixMonths:
      d.setMonth(d.getMonth() + 6)
      break
    case GroupByDuration.OneYear:
      d.setFullYear(d.getFullYear() + 1)
      break
  }

  return d
}


function getPeriodStart(date: Date, duration: GroupByDuration): Date {
  const d = new Date(date)

  switch (duration) {
    case GroupByDuration.OneWeek: {
      const day = d.getDay() // 0 = Sunday
      const diff = (day === 0 ? -6 : 1) - day // Monday as start
      d.setDate(d.getDate() + diff)
      d.setHours(0, 0, 0, 0)
      return d
    }

    case GroupByDuration.OneMonth:
      return new Date(d.getFullYear(), d.getMonth(), 1)

    case GroupByDuration.ThreeMonths: {
      const quarterStartMonth = Math.floor(d.getMonth() / 3) * 3
      return new Date(d.getFullYear(), quarterStartMonth, 1)
    }

    case GroupByDuration.SixMonths: {
      const halfStartMonth = d.getMonth() < 6 ? 0 : 6
      return new Date(d.getFullYear(), halfStartMonth, 1)
    }

    case GroupByDuration.OneYear:
      return new Date(d.getFullYear(), 0, 1)
  }
}

export function splitDataByPeriod(
  dataset: TrainingDataSet,
  duration: GroupByDuration
): PeriodData[] {
  if (!dataset._first_activity || !dataset._last_activity) return []

  const periods: PeriodData[] = []

  let currentStart = getPeriodStart(
    new Date(dataset._first_activity),
    duration
  )

  const endDate = new Date()

  while (currentStart < endDate) {
    const nextStart = getNextPeriodStart(currentStart, duration)

    const periodData = dataset.data.filter(a =>
      a.date >= currentStart && a.date < nextStart
    )

    if (periodData.length > 0) {
      periods.push(
        {
          start: new Date(currentStart),
          end: new Date(nextStart.getTime() - 1),
          data: periodData
        }
      )
    }

    currentStart = nextStart
  }

  return periods
}
