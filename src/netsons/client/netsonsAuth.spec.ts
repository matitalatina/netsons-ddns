import { NetsonsAuth } from "./netsonsAuth";

describe('NetsonsAuth', () => {
    it('should save cookie values', () => {
        const auth = new NetsonsAuth();
        const cookies = ['a', 'b', 'c'];
        auth.setCookies(cookies);
        expect(auth.getCookies()).toEqual(cookies);
    });
});