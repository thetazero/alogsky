import { Exercise, PainLogData, KayakData, LiftData, RepData, RunData, SleepData, TrainingData, PainAtLocationLogData, SleepQuality, NoteTopic, NoteData, RowData, per_minute } from "../types";
import { meters } from "@buge/ts-units/length";
import { seconds, minutes } from "@buge/ts-units/time";
import { celsius } from "@buge/ts-units/temperature";
import { kilograms, Mass } from "@buge/ts-units/mass";
import { Mass as MassDimension } from "@buge/ts-units/mass/dimension";
import { pounds } from "../types";
import { Quantity, Unit } from "@buge/ts-units";
import BodyLocation, { body_locations, Shin, Hamstring, AchillesTendon, Knee, PatellarTendon, Foot, Quad, Glute, BodyLocationWithSide, Pec, Lat, MidBack, Calf, Shoulder } from "../pt/body_location";
import { Side } from "../types";
import { get_day_string } from "../utils/time";
import { Time as TimeDimension } from "@buge/ts-units/time/dimension";
import { Length as LengthDimension } from "@buge/ts-units/length/dimension";

function parse(data: any[]): [TrainingData[], string[]] {
    const parsed = data.map(_parse);
    const training_data = parsed.filter(d => typeof d !== 'string')
    const errors = parsed.filter(d => typeof d === 'string')

    const [training_data_post, errors_post] = post_process(training_data)
    return [training_data_post, errors.concat(errors_post)]
}

function post_process(training_data: TrainingData[]): [TrainingData[], string[]] {
    const errors: string[] = []
    const sleep_days = new Set()
    training_data = training_data.filter((data) => {
        if (data.type === "sleep") {
            const day_string = get_day_string(data.date)
            if (sleep_days.has(day_string)) {
                errors.push(`Duplicate sleep log on ${day_string}`)
                return false
            } else {
                sleep_days.add(day_string)
                return true
            }
        }
        return true
    })
    return [training_data, errors]
}

const proc_map: { [key: string]: (point: any, date: Date) => TrainingData } = {
    "run1": parse_run_v1,
    "run2": parse_run_v2,
    "lift1": parse_liftv1,
    "sleep1": parse_sleepv1,
    "sleep2": parse_sleepv2,
    "pain1": parse_painv1,
    "pain2": parse_painv2,
    "lift2": parse_liftv2,
    "kayak1": parse_kayakv1,
    "note1": parse_notev1,
    "row1": parse_rowv1,
}

function _parse(point: any): TrainingData | string {
    const version = point.version;
    const type = point.type;
    const date = new Date(point.date);
    const data = point.data;
    const key = `${type}${version}`;
    if (!(key in proc_map)) {
        return `No processor for ${type} version ${version}`
    }
    try {
        return proc_map[key](data, date);
    } catch (error) {
        return `${error}`
    }
}

function parse_run_v1(data: any, date: Date): RunData {
    const title: string = data.title;
    const notes: string = data.notes;
    const distance = meters(parseFloat(data.distance));
    const duration = seconds(parseFloat(data.duration));
    return { title, notes, distance, moving_time: duration, date, type: "run" };
}
function parse_run_v2(data: any, date: Date): RunData {
    const title: string = data.title;
    const distance = meters(parseFloat(data.distance));
    const moving_time = seconds(parseFloat(data.moving_time));
    const elapsed_time = seconds(parseFloat(data.elapsed_time));

    const temperature = data.temperature !== '' ? celsius(parseFloat(data.temperature)) : undefined;
    const feels_like = data.feels_like !== '' ? celsius(parseFloat(data.feels_like)) : undefined;

    return {
        title,
        notes: "",
        distance,
        moving_time,
        elapsed_time,
        temperature,
        feels_like,
        date,
        type: "run"
    };
}

function split_unit(input: string): [string, string] {
    const match = input.match(/^\s*([\d.]+)\s*([a-zA-Z]*)$/);
    if (match) {
        return [match[1], match[2] || ""];
    } else {
        throw new Error("Unit parsing error");
    }
}

export function parse_unit(weight: string | number | undefined): Quantity<number, MassDimension | TimeDimension | LengthDimension> {
    if (weight === undefined) return pounds(0)
    if (typeof weight === 'number') return pounds(weight)
    const [value, unit] = split_unit(weight)
    const unit_map: { [key: string]: Unit<number, MassDimension | TimeDimension | LengthDimension> } = {
        "lbs": pounds,
        "kg": kilograms,
        "s": seconds,
        "meters": meters,
    }
    if (unit in unit_map) {
        return unit_map[unit](parseFloat(value));
    } else {
        return pounds(parseFloat(value));
    }
}

export function parse_units(units: string): Quantity<number, MassDimension | TimeDimension | LengthDimension>[] {
    const in_parens_data = data_if_in_parens(units)
    if (in_parens_data) {
        return in_parens_data.split("|").map(parse_unit)
    } else {
        return [parse_unit(units)]
    }
}

const defaults_for_exercise_map: [string, Exercise][] = Object.values(Exercise).map((exc) => [exc.toLowerCase(), exc])
const exercise_map: Map<string, Exercise> = new Map(
    [
        ["rows", Exercise.Row],
        ["pullups", Exercise.Pullup],
        ["pull ups", Exercise.Pullup],
        ["pull up", Exercise.Pullup],
        ["push up", Exercise.Pushup],
        ["dumbbell 1 leg, 1 arm rdl", Exercise.DumbbellOneLegOneArmRomanialDeadLift],
        ["knee drive push leg thing", Exercise.SupineKneeDrive],
        ["lateral raises", Exercise.LateralRaise],
        ["bicep curls", Exercise.BicepCurl],
        ["dumbbell flys", Exercise.DumbbellFly],
        ["crunches", Exercise.Crunch],
        ["med ball speed skaters", Exercise.MedBallSpeedSkaterJumps],
        ["dumbbell overhead press", Exercise.OverheadPress],
        ["tib raises", Exercise.TibialisRaise],
        ["dips", Exercise.Dip],
        ["lemon squeezers", Exercise.CoreRow],
        ...defaults_for_exercise_map
    ],
);

function parse_exercise(exercise: string): Exercise {
    const res = exercise_map.get(exercise.toLowerCase())
    if (res) return res
    throw `${exercise} is not a valid exercise`
}

function parse_liftv1(data: any, date: Date): LiftData {
    const title: string = data.title ?? "Lift"
    const notes: string = data.notes ?? undefined;
    const duration = minutes(parseFloat(data.duration));
    const reps = data.exercises.map((exercise: any) => {
        const rep_data: RepData = {
            exercise: parse_exercise(exercise.exercise),
            reps: parseInt(exercise.reps),
            weight: parse_unit(`${exercise.weight}`) as Mass,
        }
        return rep_data;
    });
    return {
        title,
        notes,
        duration,
        date,
        type: "lift",
        reps,
    };
}

export function make_rep_data(exercise: Exercise, reps: number, units: Quantity<number, MassDimension | TimeDimension | LengthDimension>[]): RepData {
    const mass = units.filter(unit => unit.dimension === MassDimension) as Quantity<number, MassDimension>[]
    const time = units.filter(unit => unit.dimension === TimeDimension) as Quantity<number, TimeDimension>[]
    const length = units.filter(unit => unit.dimension === LengthDimension) as Quantity<number, LengthDimension>[]
    return {
        exercise,
        reps,
        weight: mass.length ? mass[0] as Mass : pounds(0),
        time: time.length ? time[0] : undefined,
        length: length.length ? length[0] : undefined,
    }

}

export function natural_reps_parse(str: string): RepData[] {
    const [exercise, reps] = str.split(":")
    const exc = parse_exercise(exercise)
    return reps.split(",").map(rep_str => {
        if (rep_str.trim() === "") return null
        const split = rep_str.split("x")
        if (split.length <= 2) {
            const units_list = parse_units(split[1])
            return [make_rep_data(exc, parseInt(split[0]), units_list)]
        } else if (split.length === 3) {
            const [sets, reps, units] = split
            const units_list = parse_units(units)
            const res = []
            for (let i = 0; i < parseInt(sets); i++) {
                res.push(make_rep_data(exc, parseInt(reps), units_list))
            }
            return res.flat()
        }
        throw `Invalid rep string: ${rep_str}`
    }).flat().filter(rep => rep !== null)
}

function parse_liftv2(data: any, date: Date): LiftData {
    const title = data.title
    const duration = minutes(parseFloat(data.duration ?? 0));
    const notes = data.notes
    const reps = data.exercises.map((exercise: any) => {
        if (typeof exercise === 'string') {
            return natural_reps_parse(exercise)
        } else {
            if (exercise.reps.length) {
                const exc_rep = []
                for (let i = 0; i < exercise.reps.length; i++) {
                    exc_rep.push({
                        exercise: parse_exercise(exercise.exercise),
                        reps: parseInt(exercise.reps[i]),
                        weight: parse_unit(exercise.weight[i]),
                    })
                }
                return exc_rep
            } else {
                return {
                    exercise: parse_exercise(exercise.exercise),
                    reps: parseInt(exercise.reps),
                    weight: parse_unit(`${exercise.weight}`),
                }
            }
        }
    }).flat()
    return {
        title,
        notes,
        duration,
        reps,
        date,
        type: "lift",
    }
}

function parse_quality(data: string): SleepQuality | null {
    data = data.trim().toLowerCase()
    if (data === "poor") return SleepQuality.Poor
    if (data === "low") return SleepQuality.Low
    if (data === "fair") return SleepQuality.Fair
    return null
}

function parse_sleepv1(data: any, date: Date): SleepData {
    return {
        date,
        duration: minutes(parseFloat(data.duration)),
        type: "sleep",
        quality: null
    };
}

function parse_sleepv2(data: unknown, date: Date): SleepData {
    const d = as_object(data, `Sleep data v2 must be an object`)
    if (!("duration" in d) || typeof d.duration !== 'number') {
        throw `Sleep data v2 must have a duration`
    }
    const duration = minutes(d.duration)
    if (!("quality" in d) || typeof d.quality !== 'string') {
        throw `Sleep data v2 must have a quality`
    }
    const quality = d.quality
    return {
        date,
        duration,
        type: "sleep",
        quality: parse_quality(quality)
    }
}


const location_map_default: [string, BodyLocation][] = body_locations.map((loc) => [loc.name.toLowerCase(), loc])
const locations_map: Map<string, BodyLocation> = new Map([
    ...location_map_default,
    ["achilles", AchillesTendon],
    ["back inner knee tendon", Knee],
    ["back of knee", Knee], // TODO: More specific? likely tendon stuff
    ["feet", Foot],
    ["glutes", Glute],
    ["hamstrings", Hamstring],
    ["lats", Lat],
    ["lower shin", Shin],
    ["middle back", MidBack],
    ["patella", PatellarTendon],
    ["pecs", Pec],
    ["quads", Quad],
    ["shins", Shin],
    ["calves", Calf],
    ["shoulders", Shoulder],
    ["foot sciatica", Foot], // TODO: Diagnosis ???
]);

export function parse_body_location(str: string): BodyLocationWithSide[] {
    str = str.trim().toLocaleLowerCase()

    let side: Side;
    if (str.slice(0, 4) === "left") side = Side.Left
    else if (str.slice(0, 5) === "right") side = Side.Right
    else if (str.slice(0, 4) === "both") {
        const remainder = str.slice(4).trim()
        return parse_body_location(`left ${remainder}`).concat(parse_body_location(`right ${remainder}`))
    }
    else side = Side.NoSide

    const location_str = str.replace(/left|right/g, "").trim()
    const location = locations_map.get(location_str)

    if (location) return [
        new BodyLocationWithSide(location, side),
    ]
    throw `${str} is not a valid body location`
}

function parse_painv1(data: any, date: Date): PainLogData {
    const pains: PainAtLocationLogData[] = data.map((pain: any) => {
        return parse_body_location(pain.location).map(location => ({
            description: pain.description,
            pain: parseInt(pain.pain),
            location,
        }))
    }).flat()
    const location_set = new Set()
    for (const pain of pains) {
        if (location_set.has(pain.location.to_string())) {
            throw `Duplicate location ${pain.location.to_string()} in pain log on ${date.toDateString()}`
        }
        location_set.add(pain.location.to_string())
    }
    return { pains, date, type: "pain" };
}

function parse_painv2(data: unknown, date: Date): PainLogData {
    const pain_at_location: PainAtLocationLogData[] = as_array(data, `pain data v2 must be array`).map((point: any) => {
        if (typeof point !== 'object' || point === null) {
            throw "Pain data must be an array of objects"
        }
        const description = point.description
        const snapshots: PainAtLocationLogData[] = point.snapshots.map((snap: any) => {
            const [location, pain] = extract_paren_data(snap)
            return parse_body_location(location).map(loc => ({
                description,
                pain: parseInt(pain.split(",")[0]),
                location: loc,
            } as PainAtLocationLogData))
        }).flat()
        return snapshots
    }).flat()
    const res: PainLogData = { pains: pain_at_location, date, type: "pain" }
    return res
}

function parse_kayakv1(data: any, date: Date): KayakData {
    return {
        duration: minutes(parseFloat(data.duration)),
        date,
        type: "kayak",
    }
}

function str_to_topic(str: string): NoteTopic {
    const topic = str.trim().toLowerCase()
    const topic_map: Map<string, NoteTopic> = new Map([
        ["race day", NoteTopic.RaceDay],
    ])
    const topic_res = topic_map.get(topic)
    if (topic_res) return topic_res
    throw `${str} is not a valid note topic`
}

export function parse_notev1(data: any, date: Date): NoteData {
    const topic = str_to_topic(data.topic)
    return {
        title: data.title,
        content: data.content,
        date,
        type: "note",
        topic,
    }
}

function parse_rowv1(data: any, date: Date): RowData {
    return {
        title: data.title,
        description: data.description,
        moving_time: seconds(parseFloat(data.moving_time)),
        elapsed_time: seconds(parseFloat(data.elapsed_time)),
        average_heart_rate: per_minute(parseFloat(data.average_heart_rate)),
        max_heart_rate: per_minute(parseFloat(data.max_heart_rate)),
        date,
        type: "row"
    }
}

export function extract_paren_data(data: string): [string, string] {
    const match = data.match(/(.*)\((.*)\)/)
    if (match) {
        return [match[1].trim(), match[2].trim()]
    } else {
        return [data.trim(), ""]
    }
}

export function data_if_in_parens(data: string | undefined | null): string | null {
    if (data && data.length >= 2 && data[0] === "(" && data[data.length - 1] === ")") {
        return data.slice(1, data.length - 1)
    }
    return null
}

function as_array(data: unknown, err_msg: string): unknown[] {
    if (!Array.isArray(data)) {
        throw err_msg
    }
    return data
}

function as_object(data: unknown, err_msg: string): object {
    if (typeof data !== 'object' || data === null) {
        throw err_msg
    }
    return data
}

export default parse
