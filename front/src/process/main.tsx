import { RunData } from "../types";

function process(data: any[]) : RunData[] {
    return data.map(_process);
}

const proc_map: { [key: string]: (point: any, date: Date) => RunData } = {
    "run1": process_run_v1,
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
    return { title, notes, distance, duration, date, type: "run" };
} 

export default process
