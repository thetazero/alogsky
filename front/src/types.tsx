import {  Quantity, Unit } from '@buge/ts-units';
import { Length, miles } from '@buge/ts-units/length';
import { Temperature } from '@buge/ts-units/temperature';
import { minutes, Time } from '@buge/ts-units/time';
import { Mass as MassDimension } from '@buge/ts-units/mass/dimension';
import { Mass } from '@buge/ts-units/mass/';
import { kilograms } from '@buge/ts-units/mass';

export type InverseSpeedDimensions = {
    length: -1;
    time: 1;
}
export type InverseSpeed = Quantity<number, InverseSpeedDimensions>;
export const minutes_per_mile: Unit<number, InverseSpeedDimensions> = minutes.per(miles);
export const pounds: Unit<number, MassDimension> = kilograms.times(2.20462).withSymbol("lbs");

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

export enum Exercise {
    Squat = "Squat",
    Bench = "Bench",
    RomanianDeadLift = "Romanian Deadlift",
    OxidativeSquat = "Oxidative Squat",
    BicepCurl = "Bicep Curl",
}

export interface RepData {
    exercise: Exercise,
    reps: number,
    weight: Mass
}

export interface LiftData {
    title: string
    notes: string
    duration: Time
    date: Date
    reps: RepData[]
    type: "lift"
}
