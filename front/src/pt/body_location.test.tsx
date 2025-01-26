import  { BodyLocationWithSide, FootMetatarsals } from "./body_location";
import { Side } from "../types";
describe('BodyLocation', () => {
    it('Should format to string correctly', () => {
        const bodyLocation = new BodyLocationWithSide(FootMetatarsals, Side.Right);
        expect(bodyLocation.to_string()).toBe("Right Foot Metatarsals");
    });
});
