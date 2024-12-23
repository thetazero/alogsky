import { InverseSpeed } from "../types";
import { minutes_per_mile } from "../types";

export function fmt_minutes_per_mile(inverse_speed: InverseSpeed): string {
    let mpm = inverse_speed.in(minutes_per_mile).amount;
    const minutes = Math.floor(mpm);
    const seconds = Math.round((mpm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/mile`;
}
