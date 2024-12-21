export type Miles = number & { __miles__: void }
export type Minutes = number & { __minutes__: void }
export type Seconds = number & { __seconds__: void }
export type Celsius = number & { __celsius__: void }
export type Meters = number & { __meters__: void }
export type SecondsPerMeter = number & { __seconds_per_meter__: void }
export type MinutesPerMile = number & { __minutes_per_mile__: void }

export interface RunData {
    title: string
    notes: string
    distance: Meters
    moving_time: Seconds
    elapsed_time?: Seconds
    temperature?: Celsius
    feels_like?: Celsius
    date: Date
    type: "run"
}

export enum TimeOfDay {
    Morning = "morning",
    Afternoon = "afternoon",
    Evening = "evening",
}
