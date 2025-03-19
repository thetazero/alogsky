import { hours, Time } from "@buge/ts-units/time";
import { InverseSpeed, RepData } from "../types";
import { minutes_per_mile } from "../types";
import { Dimensions, Quantity } from "@buge/ts-units";

export function fmt_minutes_per_mile(inverse_speed: InverseSpeed): string {
    const mpm = inverse_speed.in(minutes_per_mile).amount;
    const minutes = Math.floor(mpm);
    const seconds = Math.floor((mpm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/mile`;
}

export function nice_number(num: number, extra_detail: number = 0): string {
    if (num < 1) return num.toFixed(2 + extra_detail);
    else if (num < 10) return num.toFixed(1 + extra_detail);
    else return num.toFixed(0 + extra_detail);
}

export function format_time(time: Time): string {
    const hrs = time.in(hours).amount;
    const minutes = Math.round((hrs - Math.floor(hrs)) * 60);
    return `${Math.floor(hrs)}:${minutes.toString().padStart(2, "0")}`;
}

export function fmt_quantity(q: Quantity<number, Dimensions>, extra_detail: number = 0): string {
    switch (q.unit) {
        case minutes_per_mile:
            return fmt_minutes_per_mile(q as InverseSpeed);
        case hours:
            return format_time(q as Time);
        default:
            return `${nice_number(q.amount, extra_detail)} ${q.unit.symbol}`;
    }
}

export function fmt_rep(rep: RepData): string {
    if (rep.weight.amount === 0) return `${rep.reps}`;
    else if (rep.reps === 0) return `${rep.weight.toString()}`;
    else return `${rep.reps} x ${rep.weight.toString()}`
}
