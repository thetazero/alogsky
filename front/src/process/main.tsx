import { RunData } from "../types";
import { meters } from "@buge/ts-units/length";
import { seconds } from "@buge/ts-units/time";
import { celsius } from "@buge/ts-units/temperature";

function process(data: any[]): RunData[] {
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
    const title: string = data.title;
    const notes: string = data.notes;
    const distance = meters(data.distance);
    const duration = seconds(data.duration);
    return { title, notes, distance, moving_time: duration, date, type: "run" };
}
function process_run_v2(data: any, date: Date): RunData {
    const title: string = data.title;
    const distance = meters(data.distance);
    const moving_time = seconds(data.moving_time);
    const elapsed_time = seconds(data.elapsed_time);

    const temperature = data.temperature !== '' ? celsius(data.temperature) : undefined;
    const feels_like = data.feels_like !== '' ? celsius(data.feels_like) : undefined;

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


export default process
