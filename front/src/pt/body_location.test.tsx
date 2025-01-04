import BodyLocation, { BodyLocationWithoutSide, Side } from "./body_location";
describe('BodyLocation', () => {
    it('Should format to string correctly', () => {
        const bodyLocation = new BodyLocation(BodyLocationWithoutSide.FootMetatarsals, Side.Right);
        expect(bodyLocation.to_string()).toBe("Right Foot Metatarsals");
    });
});
