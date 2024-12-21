import { Miles, MinutesPerMile, Seconds, Minutes } from "../types";

export function fmt_minutes_per_mile(minutes_per_mile: MinutesPerMile): string {
    const minutes = Math.floor(minutes_per_mile);
    const seconds = Math.round((minutes_per_mile - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function format_minutes_per_mile(distance: Miles, duration: Seconds): string {
    const duration_minutes = duration / 60 as Minutes;
    const minutes_per_mile = duration_minutes / distance as MinutesPerMile;
    return fmt_minutes_per_mile(minutes_per_mile);
}
