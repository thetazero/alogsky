import { hours, Time } from "@buge/ts-units/time";
import { InverseSpeed } from "../types";
import { minutes_per_mile } from "../types";
import { Dimensions, Quantity } from "@buge/ts-units";

export function fmt_minutes_per_mile(inverse_speed: InverseSpeed): string {
    const mpm = inverse_speed.in(minutes_per_mile).amount;
    const minutes = Math.floor(mpm);
    const seconds = Math.floor((mpm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/mile`;
}

export function nice_number(num: number): string {
    if (num < 1) return num.toFixed(2);
    else if (num < 10) return num.toFixed(1);
    else return num.toFixed(0);
}

export function format_time(time: Time): string {
    const hrs = time.in(hours).amount;
    const minutes = Math.round((hrs - Math.floor(hrs)) * 60);
    return `${Math.floor(hrs)}:${minutes.toString().padStart(2, "0")}`;
}

export function fmt_quantity(q: Quantity<number, Dimensions>): string {
    switch (q.unit) {
        case minutes_per_mile:
            return fmt_minutes_per_mile(q as InverseSpeed);
        case hours:
            return format_time(q as Time);
        default:
            return `${nice_number(q.amount)} ${q.unit.symbol}`;
    }
}
