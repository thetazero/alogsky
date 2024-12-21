import { Meters, Miles, MinutesPerMile, SecondsPerMeter } from '../types'

export function meters_to_miles(meters: Meters): Miles {
    return meters * 0.000621371 as Miles
}

export function seconds_per_meter_to_minutes_per_mile(seconds_per_meter: SecondsPerMeter): MinutesPerMile {
    return seconds_per_meter * 26.8224 as MinutesPerMile
}
