import { RunData } from "../types";

function process(data: any[]) : RunData[] {
    return data.map(_process);
}

const proc_map: { [key: string]: (point: any, date: Date) => RunData } = {
    "run1": process_run_v1,
    "run2": process_run_v2,
}

function _process(point: any) {
    const version = point.version;
    const type = point.type;
    const date = new Date(point.date);
    const data = point.data;
    return proc_map[`${type}${version}`](data, date);
}

function process_run_v1(data: any, date: Date): RunData {
    const title = data.title;
    const notes = data.notes;
    const distance = data.distance;
    const duration = data.duration;
    return { title, notes, distance, moving_time: duration, date, type: "run" };
} 

function process_run_v2(data: any, date: Date): RunData {
    const title = data.title;
    const distance = data.distance;
    const moving_time = data.moving_time;
    const elapsed_time = data.elapsed_time;
    const temperature = data.temperature;
    const feels_like = data.feels_like;
    return { title, notes: "", distance, moving_time, elapsed_time, temperature, feels_like, date, type: "run" };
}

export default process
