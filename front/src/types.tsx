import { Quantity, Unit } from '@buge/ts-units';
import { Length, miles } from '@buge/ts-units/length';
import { Temperature } from '@buge/ts-units/temperature';
import { minutes, Time } from '@buge/ts-units/time';

export type InverseSpeedDimensions = {
    length: -1;
    time: 1;
}
export type InverseSpeed = Quantity<number, InverseSpeedDimensions>;
export const minutes_per_mile: Unit<number, InverseSpeedDimensions> = minutes.per(miles);

export interface RunData {
    title: string
    notes: string
    distance: Length,
    moving_time: Time,
    elapsed_time?: Time,
    temperature?: Temperature,
    feels_like?: Temperature,
    date: Date
    type: "run"
}
