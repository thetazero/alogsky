
export function get_week_start(date: Date): Date {
    date = new Date(date)
    const day = (date.getDay() - 1) % 7
    date.setHours(-24 * day)
    date.setHours(0)
    date.setMilliseconds(0)
    return date
}

export function get_week_end(date: Date): Date {
    date = get_week_start(date)
    date.setHours(24 * 6)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function different_days(date1: Date, date2: Date): boolean {
    return date1.getDay() != date2.getDay() || date1.getMonth() != date2.getMonth() || date1.getFullYear() != date2.getFullYear()
}

export function calendar_days_appart(date1: Date, date2: Date): number {
    const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
    const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
    return Math.abs((day1.getTime() - day2.getTime()) / (1000 * 60 * 60 * 24))
}
