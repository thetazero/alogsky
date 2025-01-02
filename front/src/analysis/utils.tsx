export interface WithDate {
    date: Date
}

export function get_first(data: WithDate[]): WithDate {
    return data.reduce((a, b) => {
        if (a.date.getTime() < b.date.getTime()) return a
        return b
    })
}
