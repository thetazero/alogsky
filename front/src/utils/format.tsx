import { hours, minutes, seconds, Time } from "@buge/ts-units/time";
import { InverseSpeed, InverseSpeedDimensions, RepData } from "../types";
import { minutes_per_mile } from "../types";
import { Dimensions, Quantity } from "@buge/ts-units";
import { Time as TimeDimensions } from "@buge/ts-units/time/dimension";

export function fmt_minutes_per_mile(inverse_speed: InverseSpeed): string {
    const mpm = inverse_speed.in(minutes_per_mile).amount;
    const minutes = Math.floor(mpm);
    const seconds = Math.floor((mpm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/mile`;
}

export function nice_number(num: number, extra_detail: number = 0): string {
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    if (num < 1) return num.toFixed(2 + extra_detail);
    else if (num < 10) return num.toFixed(1 + extra_detail);
    else return num.toFixed(0 + extra_detail);
}

export function format_time(time: Time): string {
    if (time < minutes(1)) {
        return `${time.in(seconds).amount.toFixed(1)}s`;
    } else if (time < hours(1)) {
        const mins = Math.floor(time.in(minutes).amount);
        const secs = Math.floor((time.in(minutes).amount - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    const hrs = time.in(hours).amount;
    const mins = Math.round((hrs - Math.floor(hrs)) * 60);
    return `${Math.floor(hrs)}:${mins.toString().padStart(2, "0")}`;
}

export function fmt_quantity(q: Quantity<number, Dimensions>, extra_detail: number = 0): string {
    switch (q.unit.dimension) {
        case InverseSpeedDimensions:
            return fmt_minutes_per_mile(q as InverseSpeed);
        case TimeDimensions:
            return format_time(q as Time);
        default:
            return `${nice_number(q.amount, extra_detail)} ${q.unit.symbol}`;
    }
}

export function fmt_rep(rep: RepData): string {
    if (rep.weight.amount === 0) {
        if (rep.time) return `${rep.reps} x ${rep.time.in(seconds).amount.toFixed(0)}s`;
        return `${rep.reps}`;
    }
    else if (rep.reps === 0) return `${rep.weight.toString()}`;
    else if (rep.time) return `${rep.reps} x ${fmt_quantity(rep.weight)} (${fmt_quantity(rep.time)})`;
    else return `${rep.reps} x ${rep.weight.toString()}`
}
