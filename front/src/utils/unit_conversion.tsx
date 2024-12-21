import { Meters, Miles } from '../types'

export function meters_to_miles(meters: Meters): Miles {
    return meters * 0.000621371 as Miles
}
