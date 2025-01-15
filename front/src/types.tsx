import { Quantity, Unit } from '@buge/ts-units';
import { Length, miles } from '@buge/ts-units/length';
import { Temperature } from '@buge/ts-units/temperature';
import { minutes, Time } from '@buge/ts-units/time';
import { Mass as MassDimension } from '@buge/ts-units/mass/dimension';
import { Mass } from '@buge/ts-units/mass/';
import { kilograms } from '@buge/ts-units/mass';
import BodyLocation from './pt/body_location';

export type InverseSpeedDimensions = {
    length: -1;
    time: 1;
}
export type InverseSpeed = Quantity<number, InverseSpeedDimensions>;
export const minutes_per_mile: Unit<number, InverseSpeedDimensions> = minutes.per(miles);
export const pounds: Unit<number, MassDimension> = kilograms.times(1/2.20462).withSymbol("lbs");
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
    Bench = "Bench",
    BicepCurl = "Bicep Curl",
    BulgarianSplitSquat = "Bulgarian Split Squat",
    CableSeatedRow = "Cable Seated Row",
    DeadBugs = "Dead Bugs",
    DumbellOneLegOneArmRomanialDeadLift = "Dumbell One Leg One Arm Romanian Deadlift",
    FourtyFiveDegreeBackExtension = "45 Degree Back Extension",
    LateralRaise = "Lateral Raise",
    LemonSqueezers = "Lemon Squeezers",
    MedBallSeatedRussianTwist = "Med Ball Seated Russian Twist",
    OneLegBuck = "One Leg Buck",
    OverheadPress = "Overhead Press",
    OxidativeSquat = "Oxidative Squat",
    Plank = "Plank",
    Pullup = "Pullup",
    Pushup = "Pushup",
    RomanianDeadLift = "Romanian Deadlift",
    Row = "Row",
    SupineKneeDrive = "Supine Knee Drive", // https://www.youtube.com/watch?v=wpt_RPlfcR4 (but without the band)
    ShortFootExercise = "Short Foot Exercise",
    SingleLegCalfRaise = "Single Leg Calf Raise",
    SingleLegStairCalfRaise = "Single Leg Stair Calf Raise",
    Situp = "Situp",
    SpeedSkaterJumps = "Speed Skater Jumps",
    Squat = "Squat",
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

export interface PainAtLocationLogData {
    pain: number
    description: string
    location: BodyLocation
}

export interface PainLogData {
    pains: PainAtLocationLogData[]
    date: Date
    type: "pain"
}

export interface KayakData {
    duration: Time
    date: Date
    type: "kayak"
}

export interface PainAtLocationData {
    location: BodyLocation
    snapshots: PainSnapshotsData[]
}

export interface PainSnapshotsData {
    description: string
    pain: number
    date: Date
}

export type TrainingData = RunData | LiftData | SleepData | PainLogData | KayakData;
export enum Metric {
    Mileage = "Mileage",
    Pace = "Pace",
    ActiveTime = "Active Time",
    Tonage = "Tonage",
}
