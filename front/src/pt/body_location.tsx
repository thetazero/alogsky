export enum Side {
    Left,
    Right,
    NoSide,
}

export enum BodyLocationWithoutSide {
    AchillesTendon = "Achilles Tendon",
    Ankle = "Ankle",
    Calf = "Calf",
    Core = "Core",
    FootMetatarsals = "Foot Metatarsals",
    Hamstring = "Hamstring",
    Heel = "Heel",
    HipFlexor = "Hip Flexor",
    Knee = "Knee",
    LowerBack = "Lower Back",
    Plantar = "Plantar",
    Quad = "Quad",
    Shin = "Shin",
    UpperBack = "Upper Back",
    ITBand = "IT Band",
}

class BodyLocation {
    location: BodyLocationWithoutSide;
    side: Side
    description?: string;

    constructor(location: BodyLocationWithoutSide, side: Side, description?: string) {
        this.location = location;
        this.side = side;
        this.description = description;
    }

    to_string(){
        return `${this.side === Side.Left ? "Left" : this.side === Side.Right ? "Right" : ""} ${this.location}`;
    }

    equals(other: BodyLocation){
        return this.location === other.location && this.side === other.side;
    }
}

export default BodyLocation;
