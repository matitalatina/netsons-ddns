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
        const res = await this.fetch(
            `https://www.netsons.com/manage/index.php?m=pdns&domainid=${domainId}`,
            {
                "headers": new Headers([
                    ["accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"],
                    ["accept-language", "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"],
                    ["cache-control", "max-age=0"],
                    ["upgrade-insecure-requests", "1"],
                    ["cookie", cookieValue.join('; ')],
                ]),
                "method": "GET",
            });

        return res.text();
    }

    async updateDomainEntry(domainId: number, oldEntry: IDnsEntry, updatedEntry: IDnsUpdate): Promise<boolean> {
        const cookieValue = [
            'pagelimit=1',
            'domviews={"status":"","views":"25","predicate":""}',
            'tktviews={"status":"","views":"10","predicate":""}',
            ...this.auth.getCookies(),
        ];
        const response = await this.fetch(
            `https://www.netsons.com/manage/index.php?m=pdns&domainid=${domainId}&ajax=edit`,
            {
                "headers": new Headers([
                    ["accept", "*/*"],
                    ["accept-language", "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"],
                    ["content-type", "application/x-www-form-urlencoded; charset=UTF-8"],
                    ["x-requested-with", "XMLHttpRequest"],
                    ["cookie", cookieValue.join('; ')],
                ]),
                "body": `old_name=${oldEntry.name}&old_type=${oldEntry.type}&old_content=${oldEntry.content}&old_ttl=${oldEntry.ttl}&new_name=${updatedEntry.name}&new_type=${updatedEntry.type}&new_content=${updatedEntry.content}&new_ttl=${updatedEntry.ttl}`,
                "method": "POST",
            });
        return response.status < 400;
    }

}

