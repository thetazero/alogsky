
export function get_week_start(date: Date): Date {
    date = new Date(date)
    const day = (date.getDay() - 1) % 7
    date.setHours(-24 * day)
    date.setHours(0)
    date.setMilliseconds(0)
    return date
}
