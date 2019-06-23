import { NetsonsAuth } from './../client/netsonsAuth';
import { Config } from './../../config/config';
import { DomainExtractor } from '../client/extractors/domainExtractor';
import { mock, when, instance, verify } from 'ts-mockito';
import { NetsonsClient } from '../client/netsonsClient';
import { DomainService } from './domainService';
import fetch from 'node-fetch';

const domainExtractorMock = mock(DomainExtractor);
const netsonsClientMock = mock(NetsonsClient);
const configMock = mock(Config);

describe('DomainService', () => {
    it('should keep updated the dns entry', async () => {
        const email = 'email@email.it';
        const password = 'password';
        const oldEntry: IDnsEntry = {
            name: 'www.example.it',
            content: '192.168.1.1',
            ttl: 300,
            type: 'A',
        };
        const updatedEntry: IDnsUpdate = {
            name: 'www.example.it',
            content: '192.168.1.2',
            ttl: 400,
            type: 'A',
        };
        const fakeDomainHtml = '<html></html';
        const domainId = 123;

        when(configMock.getDomainId()).thenReturn(domainId);
        when(configMock.getEmail()).thenReturn(email);
        when(configMock.getPassword()).thenReturn(password);
        when(netsonsClientMock.login(email, password)).thenResolve(true);
        when(netsonsClientMock.getDomainPage(domainId)).thenResolve(fakeDomainHtml);
        when(domainExtractorMock.fromHtml(fakeDomainHtml)).thenReturn([
            {name: 'useless.it', content: '123.123.123.123', ttl: 400, type: 'A'},
            oldEntry,
        ]);
        when(netsonsClientMock.updateDomainEntry(domainId, oldEntry, updatedEntry)).thenResolve(true);

        const service = new DomainService(
            instance(configMock), 
            instance(netsonsClientMock),
            instance(domainExtractorMock)
        );

        await service.keepDnsUpdated(updatedEntry);
        
        verify(configMock.getDomainId()).once();
        verify(configMock.getEmail()).once();
        verify(configMock.getPassword()).once();
        verify(netsonsClientMock.login(email, password)).once();
        verify(netsonsClientMock.getDomainPage(domainId)).once();
        verify(domainExtractorMock.fromHtml(fakeDomainHtml)).once();
        verify(netsonsClientMock.updateDomainEntry(domainId, oldEntry, updatedEntry)).once();
    });
});
