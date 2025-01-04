import { kilograms } from "@buge/ts-units/mass";
import { pounds } from "./types";

describe('Test units', () => {
    it('Converts pounds to kilograms', () => {
        expect(kilograms(1).in(pounds).amount).toBeCloseTo(2.20462);
    });
});
