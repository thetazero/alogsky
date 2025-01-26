import { BodyRegion, Side } from "../types";

export class BodyLocationWithSide {
    location: BodyLocation;
    side: Side;

    constructor(location: BodyLocation, side: Side) {
        this.location = location;
        this.side = side;
    }

    to_string() {
        return `${this.side === Side.Left ? "Left" : this.side === Side.Right ? "Right" : ""} ${this.location}`;
    }

    equals(other: BodyLocationWithSide) {
        return this.location === other.location && this.side === other.side;
    }

    region() {
        return this.location.region;
    }
}

class BodyLocation {
    name: string;
    region: BodyRegion;
    description?: string;

    constructor(name: string, region: BodyRegion, description?: string) {
        this.name = name;
        this.region = region;
        this.description = description;
    }

    to_string() {
        return this.name;
    }

    equals(other: BodyLocation) {
        return this.name === other.name;
    }
}

export const AchillesTendon = new BodyLocation("Achilles Tendon", BodyRegion.Ankle)
export const Ankle = new BodyLocation("Ankle", BodyRegion.Ankle)
export const Calf = new BodyLocation("Calf", BodyRegion.LowerLeg)
export const Core = new BodyLocation("Core", BodyRegion.Core)
export const Foot = new BodyLocation("Foot", BodyRegion.Foot)
export const FootMetatarsals = new BodyLocation("Foot Metatarsals", BodyRegion.Foot)
export const Glute = new BodyLocation("Glute", BodyRegion.Hip)
export const Hamstring = new BodyLocation("Hamstring", BodyRegion.Hamstring)
export const Heel = new BodyLocation("Heel", BodyRegion.Foot)
export const HipFlexor = new BodyLocation("Hip Flexor", BodyRegion.Hip)
export const Knee = new BodyLocation("Knee", BodyRegion.Knee)
export const Lat = new BodyLocation("Lat", BodyRegion.Chest) // Not sure about this one
export const LowerCore = new BodyLocation("Lower Core", BodyRegion.Core)
export const LowerBack = new BodyLocation("Lower Back", BodyRegion.Back)
export const PatellarTendon = new BodyLocation("Patellar Tendon", BodyRegion.Knee)
export const Plantar = new BodyLocation("Plantar", BodyRegion.Foot)
export const Quad = new BodyLocation("Quad", BodyRegion.Quad)
export const Shin = new BodyLocation("Shin", BodyRegion.LowerLeg)
export const Shoulder = new BodyLocation("Shoulder", BodyRegion.Shoulder)
export const Toes = new BodyLocation("Toes", BodyRegion.Foot)
export const Tricep = new BodyLocation("Tricep", BodyRegion.Arm)
export const UpperBack = new BodyLocation("Upper Back", BodyRegion.Back)
export const ITBand = new BodyLocation("IT Band", BodyRegion.Hip)

export const body_locations: BodyLocation[] = [
    AchillesTendon,
    Ankle,
    Calf,
    Core,
    Foot,
    FootMetatarsals,
    Glute,
    Hamstring,
    Heel,
    HipFlexor,
    Knee,
    Lat,
    LowerCore,
    LowerBack,
    PatellarTendon,
    Plantar,
    Quad,
    Shin,
    Shoulder,
    Toes,
    Tricep,
    UpperBack,
    ITBand,
];

export default BodyLocation;
