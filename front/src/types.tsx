import { makeUnit, One, Quantity, Unit } from '@buge/ts-units';
import { Length, miles } from '@buge/ts-units/length';
import { Temperature } from '@buge/ts-units/temperature';
import { minutes, Time } from '@buge/ts-units/time';
import { Mass as MassDimension } from '@buge/ts-units/mass/dimension';
import { Mass } from '@buge/ts-units/mass/';
import { kilograms } from '@buge/ts-units/mass';
import { BodyLocationWithSide } from './pt/body_location';

export type InverseSpeedDimensions = {
    length: -1;
    time: 1;
}
export type InverseSpeed = Quantity<number, InverseSpeedDimensions>;
export type FrequencyDimensions = {
    time: -1;
}
export type Frequency = Quantity<number, FrequencyDimensions>;
export const unitless: Unit<number, One> = makeUnit("", One)
export const minutes_per_mile: Unit<number, InverseSpeedDimensions> = minutes.per(miles);
export const pounds: Unit<number, MassDimension> = kilograms.times(1 / 2.20462).withSymbol("lbs");
export const tons: Unit<number, MassDimension> = pounds.times(2000).withSymbol("tons");
export const per_minute: Unit<number, FrequencyDimensions> = minutes.reciprocal();

export interface RunData {
    title: string
    notes: string
    distance: Length,
    moving_time: Time,
    elapsed_time?: Time,
    temperature?: Temperature,
    feels_like?: Temperature,
    workout?: RunningWorkoutData,
    description?: string,
    private_note?: string,
    shoe?: string,
    date: Date
    type: "run"
}

export interface RunningWorkoutData {
    intervals: Interval[],
}

export interface Interval {
    duration?: Time,
    distance?: Length,
}

export enum Exercise {
    AnteriorBunkie = "Anterior Bunkie",
    BarbellRdl = "Barbell Romanian Deadlift",
    Bench = "Bench",
    BicepCurl = "Bicep Curl",
    BulgarianSplitSquat = "Bulgarian Split Squat",
    CableSeatedRow = "Cable Seated Row",
    CoreRow = "Core Row",
    Crunch = "Crunch",
    DeadBugs = "Dead Bugs",
    Dip = "Dip",
    DumbbellBench = "Dumbbell Bench",
    DumbbellFly = "Dumbbell Fly",
    DumbbellInclineBench = "Dumbbell Incline Bench",
    DumbbellOneLegOneArmRomanialDeadLift = "Dumbbell One Leg One Arm Romanian Deadlift",
    DumbbellRow = "Dumbbell Row",
    FarmerCary = "Farmer Cary",
    FourtyFiveDegreeBackExtension = "45 Degree Back Extension",
    LateralBunkie = "Lateral Bunkie",
    LateralRaise = "Lateral Raise",
    LedgeTricepDip = "Ledge Tricep Dip",
    LemonSqueezers = "Lemon Squeezers",
    MedBallSeatedRussianTwist = "Med Ball Seated Russian Twist",
    MedBallSpeedSkaterJumps = "Med Ball Speed Skater Jumps",
    MedialBunkie = "Medial Bunkie",
    NordicCurl = "Nordic Curl",
    OneLegBuck = "One Leg Buck",
    OverheadPress = "Overhead Press",
    OxidativeSquat = "Oxidative Squat",
    Plank = "Plank",
    PlateMcGillCrunch = "Plate McGill Crunch",
    Pullup = "Pullup",
    Pushup = "Pushup",
    RomanianDeadLift = "Romanian Deadlift",
    Row = "Row",
    RushNTwist = "Rush N Twist",
    ShortFootExercise = "Short Foot Exercise",
    SideLegLift = "Side Leg Lift",
    SingleLegCalfRaise = "Single Leg Calf Raise",
    SingleLegSquat = "Single Leg Squat",
    SingleLegStairCalfRaise = "Single Leg Stair Calf Raise",
    Situp = "Situp",
    SpeedSkaterJumps = "Speed Skater Jumps",
    Squat = "Squat",
    SupineKneeDrive = "Supine Knee Drive", // https://www.youtube.com/watch?v=wpt_RPlfcR4 (but without the band)
    TibialisRaise = "Tibialis Raise",
    TricepExtension = "Tricep Extension",
}

export enum SleepQuality {
    Poor = "Poor",
    Low = "Low",
    Fair = "Fair",
}

export interface RepData {
    exercise: Exercise,
    reps: number,
    weight: Mass
    length?: Length
    time?: Time
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
    quality: SleepQuality | null
}

export interface PainAtLocationLogData {
    pain: number
    description: string
    location: BodyLocationWithSide
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
    location: BodyLocationWithSide
    snapshots: PainSnapshotsData[]
}

export interface PainSnapshotsData {
    description: string
    pain: number // 1-5 1: barely noticable, 2: noticable, 3: annoying, 4: painful, 5: excruciating
    date: Date
}

export interface NoteData {
    title: string
    content: string
    date: Date
    type: "note"
    topic: NoteTopic
}

export enum NoteTopic {
    RaceDay = "Race Day",
}

export interface RowData {
    title: string
    date: Date
    description: string
    moving_time: Time
    elapsed_time: Time
    average_heart_rate: Frequency
    max_heart_rate: Frequency
    type: "row"
}

export interface BikeData {
    title: string
    date: Date
    description: string
    moving_time: Time
    average_heartrate?: Frequency
    distance?: Length
    type: "bike"
}

export type TrainingData = RunData | LiftData | SleepData | PainLogData | KayakData | NoteData | RowData | BikeData
export enum Metric {
    Mileage = "Mileage",
    Pace = "Pace",
    ActiveTime = "Active Time",
    Tonage = "Tonage",
    MeanFatigueScore = "MFS"
} export enum Side {
    Left,
    Right,
    NoSide
}// Regions of body for running / estimating fatigue score

export enum BodyRegion {
    Ankle = "Ankle",
    Arm = "Arms",
    Back = "Back",
    Chest = "Chest",
    Core = "Core",
    Foot = "Foot",
    Hamstring = "Hamstring",
    Hip = "Hip",
    Knee = "Knee",
    LowerLeg = "LowerLeg",
    Quad = "Quad",
    Shoulder = "Shoulder",
}
