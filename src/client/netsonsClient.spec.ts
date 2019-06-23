import fetch from 'node-fetch';
import { Config } from './../config/config';
import { NetsonsClient } from "./netsonsClient";
import { Response, Headers, RequestInfo, RequestInit } from 'node-fetch';
import {mock, instance, when, deepEqual, verify, match} from 'ts-mockito';
import { NetsonsAuth } from './netsonsAuth';
import {writeFileSync} from 'fs';
const authMock = mock(NetsonsAuth);
describe('NetsonsClient', () => {
    it('should login', async () => {
        const password = 'mypassw*';
        const email = 'email@email.it';
        const headers: Headers = new Headers([
            ['set-cookie', 'WHMCSpYYh2aRyx84q=3moh112lklf2pf3lhasdsad4afbm51jn53; path=/; secure; HttpOnly'],
            ['set-cookie', 'WHMCSUser=144847%3A%3A1de412c5asdadsac3b1sad9863a28bc3817aa20b5ccc94; expires=Tue, 23-Jun-2020 07:49:15 GMT; Max-Age=31622400; path=/; httponly'],
            ['set-cookie', 'loggedUser=%7B%22uid%22%3A144847%2C%22creation_time%22%3A%222019-06-23+09%3A49%3A15%22%2C%22nome%22%3A%22Name%22%2C%22cognome%22%3A%22Surname%22%7D; expires=Sun, 23-Jun-2019 08:49:15 GMT; Max-Age=3600; path=/; domain=netsons.com'],
        ]);
        const authCookies = headers.raw()['set-cookie'];

        const fetchMock = async (url: RequestInfo, init?: RequestInit): Promise<Response> => {    
            expect(url).toEqual('https://www.netsons.com/manage/dologin.php');
            expect(init && init.body).toEqual(`token=917cb382d5547e1419728d80b6fc1add7baa779a&token=917cb382d5547e1419728d80b6fc1add7baa779a&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&rememberme=on`);
            const response = new Response("", {
                headers: headers,
            });
            return Promise.resolve(response)
        };
        const client = new NetsonsClient(fetchMock, instance(authMock));

        expect(await client.login(email, password)).toEqual(true);
        verify(authMock.setCookies(deepEqual([
            'WHMCSpYYh2aRyx84q=3moh112lklf2pf3lhasdsad4afbm51jn53',
            'WHMCSUser=144847%3A%3A1de412c5asdadsac3b1sad9863a28bc3817aa20b5ccc94',
            'loggedUser=%7B%22uid%22%3A144847%2C%22creation_time%22%3A%222019-06-23+09%3A49%3A15%22%2C%22nome%22%3A%22Name%22%2C%22cognome%22%3A%22Surname%22%7D',
        ]))).once();
    });

    it('should get dns manage page', async () => {
        const domainId = 123123;
        const expectedResponse = '<html></html>';
        const fetchMock = async (url: RequestInfo, init?: RequestInit): Promise<Response> => {    
            expect(url).toEqual(`https://www.netsons.com/manage/index.php?m=pdns&domainid=${domainId}`);
            const response = new Response(expectedResponse);
            const headersRaw = init && init.headers && (init.headers as any as Headers).raw();
            expect(headersRaw && headersRaw.cookie).toEqual(['pagelimit=1; domviews={"status":"","views":"100","predicate":""}; a=a; b=b']);
            return Promise.resolve(response)
        };
        when(authMock.getCookies()).thenReturn([
            'a=a',
            'b=b',
        ]);
        const client = new NetsonsClient(fetchMock, instance(authMock));
        const returnedBody = await client.getDomainPage(domainId);
        expect(returnedBody).toEqual(expectedResponse);
    });
});