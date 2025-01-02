import { Quantity, Unit } from '@buge/ts-units';
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
export const tons: Unit<number, MassDimension> = pounds.times(2000).withSymbol("tons");

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
    Row = "Row",
    Pullup = "Pullup",
    SingleLegCalfRaise = "Single Leg Calf Raise",
    LateralRaise = "Lateral Raise",
    OverheadPress = "Overhead Press",
    Pushup = "Pushup",
    Situp = "Situp",
    BulgarianSplitSquat = "Bulgarian Split Squat",
    ShortFootExercise = "Short Foot Exercise"
}

export interface RepData {
    exercise: Exercise,
    reps: number,
    weight: Mass
}

export interface LiftData {
    title?: string
    notes?: string
    duration: Time
    date: Date
    reps: RepData[]
    type: "lift"
}

export interface SleepData {
    duration: Time
    date: Date
    type: "sleep"
}

export interface PainData {
    pain: number
    description: string
    location: BodyLocation
}

export interface PainSnapshotData {
    pains: PainData[]
    date: Date
    type: "injury"
}

export interface KayakData {
    duration: Time
    date: Date
    type: "kayak"
}

export enum BodyLocation { 
    RightFootMetatarsals = "Right Foot Metatarsals",
    LeftShin = "Left Shin",
    RightShin = "Right Shin",
    LeftPlantar = "Left Plantar",
}

export interface InjuryData {
    location: BodyLocation
    snapshots: InjurySnapshots[]
}

export interface InjurySnapshots {
    description: string
    pain: number
    date: Date
}

export type TrainingData = RunData | LiftData | SleepData | PainSnapshotData | KayakData;
