import { BodyRegion, Side } from "../types";

export class BodyLocationWithSide {
    location: BodyLocation;
    side: Side;

    constructor(location: BodyLocation, side: Side) {
        this.location = location;
        this.side = side;
    }

    to_string() {
        return `${this.side === Side.Left ? "Left" : this.side === Side.Right ? "Right" : ""} ${this.location.name}`;
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
export const Bicep = new BodyLocation("Bicep", BodyRegion.Arm)
export const Calf = new BodyLocation("Calf", BodyRegion.LowerLeg)
export const Core = new BodyLocation("Core", BodyRegion.Core)
export const Elbow = new BodyLocation("Elbow", BodyRegion.Arm)
export const Foot = new BodyLocation("Foot", BodyRegion.Foot)
export const FootMetatarsals = new BodyLocation("Foot Metatarsals", BodyRegion.Foot)
export const FootSole = new BodyLocation("Foot Sole", BodyRegion.Foot)
export const Forearm = new BodyLocation("Forearm", BodyRegion.Arm)
export const Glute = new BodyLocation("Glute", BodyRegion.Hip)
export const Hamstring = new BodyLocation("Hamstring", BodyRegion.Hamstring)
export const Heel = new BodyLocation("Heel", BodyRegion.Foot)
export const Hip = new BodyLocation("Hip", BodyRegion.Hip)
export const HipFlexor = new BodyLocation("Hip Flexor", BodyRegion.Hip)
export const ITBand = new BodyLocation("IT Band", BodyRegion.Hip)
export const InnerBackKneeTendon = new BodyLocation("Inner Back Knee Tendon", BodyRegion.Knee)
export const Knee = new BodyLocation("Knee", BodyRegion.Knee)
export const Lat = new BodyLocation("Lat", BodyRegion.Chest) // Not sure about this one
export const LowerBack = new BodyLocation("Lower Back", BodyRegion.Back)
export const LowerCore = new BodyLocation("Lower Core", BodyRegion.Core)
export const MidBack = new BodyLocation("Mid Back", BodyRegion.Back)
export const PatellarTendon = new BodyLocation("Patellar Tendon", BodyRegion.Knee)
export const Pec = new BodyLocation("Pec", BodyRegion.Chest)
export const Plantar = new BodyLocation("Plantar", BodyRegion.Foot)
export const Quad = new BodyLocation("Quad", BodyRegion.Quad)
export const Shin = new BodyLocation("Shin", BodyRegion.LowerLeg)
export const Shoulder = new BodyLocation("Shoulder", BodyRegion.Shoulder)
export const Tibialis = new BodyLocation("Tibialis", BodyRegion.LowerLeg)
export const Toes = new BodyLocation("Toes", BodyRegion.Foot)
export const Tricep = new BodyLocation("Tricep", BodyRegion.Arm)
export const UpperBack = new BodyLocation("Upper Back", BodyRegion.Back)
export const UpperCore = new BodyLocation("Upper Core", BodyRegion.Core)

export const body_locations: BodyLocation[] = [
    AchillesTendon,
    Ankle,
    Bicep,
    Calf,
    Core,
    Elbow,
    Foot,
    FootMetatarsals,
    FootSole,
    Forearm,
    Glute,
    Hamstring,
    Heel,
    Hip,
    HipFlexor,
    ITBand,
    InnerBackKneeTendon,
    Knee,
    Lat,
    LowerBack,
    LowerCore,
    MidBack,
    PatellarTendon,
    Pec,
    Plantar,
    Quad,
    Shin,
    Shoulder,
    Tibialis,
    Toes,
    Tricep,
    UpperBack,
    UpperCore,
];

export default BodyLocation;
