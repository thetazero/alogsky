export type Miles = number & { __miles__: void }
export type Minutes = number & { __minutes__: void }

export interface RunData {
    title: string
    notes: string
    distance: Miles
    duration: Minutes
    date: Date
    type: "run"
}
