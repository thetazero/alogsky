export enum Side {
    Left,
    Right,
    NoSide,
}

export enum BodyLocationWithoutSide {
    FootMetatarsals = "Foot Metatarsals",
    Shin = "Shin",
    Plantar = "Plantar",
    UpperBack = "Upper Back",
    HipFlexor = "Hip Flexor",
    Knee = "Knee",
    Heel = "Heel",
    Core = "Core",
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
