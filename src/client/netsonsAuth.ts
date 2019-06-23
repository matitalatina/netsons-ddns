export class NetsonsAuth {
    private _cookies: string[] = [];

    getCookies(): string[] {
        return this._cookies;
    }
    
    setCookies(cookies: string[]) {
        this._cookies = cookies;
    }
}