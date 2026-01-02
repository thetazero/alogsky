export enum GroupByDuration {
  OneWeek = '1_week',
  OneMonth = '1_month',
  ThreeMonths = '3_months',
  SixMonths = '6_months',
  OneYear = '1_year'
}

interface Props {
  value: GroupByDuration
  onChange: (value: GroupByDuration) => void
}

export function DurationSelector({ value, onChange }: Props) {
  const options = [
    { value: GroupByDuration.OneWeek, label: '1 Week' },
    { value: GroupByDuration.OneMonth, label: '1 Month' },
    { value: GroupByDuration.ThreeMonths, label: '3 Months' },
    { value: GroupByDuration.SixMonths, label: '6 Months' },
    { value: GroupByDuration.OneYear, label: '1 Year' },
  ]

  return (
    <div className="flex gap-2 bg-level-2 rounded-lg p-1">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded transition-colors text-sm ${
            value === option.value
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-level-1'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
