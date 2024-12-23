import { InverseSpeed } from "../types"
import { minutes, seconds } from "@buge/ts-units/time"
import { miles } from "@buge/ts-units/length"

export function seconds_per_mile(inverse_speed: InverseSpeed): number {
    return inverse_speed.in(seconds.per(miles)).amount;
}
