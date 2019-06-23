import { Config } from './../config/config';
import { Response, Headers, RequestInfo, RequestInit } from "node-fetch";
import { NetsonsAuth } from './netsonsAuth';

function parseCookies(response: Response): string[] {
    const raw = response.headers.raw()['set-cookie'];
    return raw.map((entry) => {
        const parts = entry.split(';');
        const cookiePart = parts[0];
        return cookiePart;
    });
};

export class NetsonsClient {
    constructor(
        private fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
        private auth: NetsonsAuth,
    ) {

    }
    private loginCookies: string = '';

    async login(email: string, password: string): Promise<boolean> {
        const res = await this.fetch(
            "https://www.netsons.com/manage/dologin.php",
            {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "upgrade-insecure-requests": "1"
                },
                "body": `token=917cb382d5547e1419728d80b6fc1add7baa779a&token=917cb382d5547e1419728d80b6fc1add7baa779a&username=${encodeURIComponent(email)}&password=${password}&rememberme=on`,
                "method": "POST"
            })
        const cookies = parseCookies(res);
        this.auth.setCookies(cookies);
        return res.status < 400;
    }

    async getDomainPage(domainId: number): Promise<string> {
        const cookieValue = [
            'pagelimit=1',
            'domviews={"status":"","views":"100","predicate":""}',
            ...this.auth.getCookies(),
        ];
        const headers = new Headers([
            ["accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"],
            ["accept-language", "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"],
            ["cache-control", "max-age=0"],
            ["upgrade-insecure-requests", "1"],
            ["cookie", cookieValue.join('; ')],
        ]);
        const res = await this.fetch(
            `https://www.netsons.com/manage/index.php?m=pdns&domainid=${domainId}`,
            {
                "headers": headers as any,
                "body": undefined,
                "method": "GET",
            });

        return res.text();
    }

}

