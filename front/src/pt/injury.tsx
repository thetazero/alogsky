export class InjuryType {
    name: string;
    description?: string;
    constructor(name: string, description?: string) {
        this.name = name;
        this.description = description
    }
}

export const Sciatica = new InjuryType("Sciatica")
