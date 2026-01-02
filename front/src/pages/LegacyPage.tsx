import { TrainingDataSet } from '../analysis/analysis'
import WeekOverview from '../tiles/WeekOverview'
import TrainingLogTile from '../tiles/TrainingLogTile'
import TrainingSummaryTile from '../tiles/TrainingSummaryTile'
import CommandProvider from '../CommandProvider'
import ParticularLiftTile from '../tiles/ParticularLiftTile'
import LiftLogTile from '../tiles/LiftLogTile'

interface Props {
  dataset: TrainingDataSet
  parseErrors: string[]
}

export function LegacyPage({ dataset, parseErrors }: Props) {
  const defaultTiles = [
    {
      component: WeekOverview,
      id: "week-overview"
    },
    {
      component: TrainingSummaryTile,
      id: "training-summary"
    },
    {
      component: TrainingLogTile,
      id: "training-log"
    },
    {
      component: ParticularLiftTile,
      id: "particular-lift"
    },
    {
      component: LiftLogTile,
      id: "lift-log"
    }
  ]

  return (
    <CommandProvider defaultTiles={defaultTiles} parseErrors={parseErrors} dataset={dataset} />
  )
}
