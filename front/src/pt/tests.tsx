import { InjuryType, Sciatica } from "./injury";

export class InjuryTest {
    injury: InjuryType;
    name: string;
    description: string;

    constructor(injury: InjuryType, name: string, description: string) {
        this.injury = injury;
        this.name = name;
        this.description = description;
    }
}

export const SlumpTest = new InjuryTest(Sciatica, "Slump Test", "This test includes the patient seated upright with hands behind the back. The patient bends (slumps) forward at the hip. The neck is bent down with the chin touching the chest and one knee is extended to a degree possible. If pain occurs in this position, sciatica may be present.");
export const StraightLegRaise = new InjuryTest(Sciatica, "Straight Leg Raise", "This test includes the patient lying on his/her back and lifting one leg at a time with the other leg flat or bent at the knee. A pain encountered while lifting the affected leg usually indicates sciatica.");
const AllTests = [SlumpTest];
