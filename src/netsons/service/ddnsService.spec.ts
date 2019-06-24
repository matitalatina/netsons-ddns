import { DomainService } from './domainService';
import { Config } from './../../config/config';
import { DdnsService } from "./ddnsService";
import { IpService } from "./ipService";
import { mock, instance, when, verify, deepEqual } from "ts-mockito";

const ipServiceMock = mock(IpService); 
const configMock = mock(Config);
const domainService = mock(DomainService);

describe('DdnsService', () => {
    it('should keep updated the dns entry name', async () => {
        const service = new DdnsService(
            instance(configMock),
            instance(ipServiceMock),
            instance(domainService),
        );

        const ip = '192.168.1.1';
        const domainName = 'www.example.it';
        const expectedDnsEntry: IDnsUpdate = {
            name: domainName,
            content: ip,
            type: 'A',
            ttl: 300,
        };
            
        when(ipServiceMock.getPublicIp()).thenResolve(ip);
        when(configMock.getDnsEntryName()).thenReturn(domainName);

        await service.keepDdnsUpdated();

        verify(domainService.keepDnsUpdated(deepEqual(expectedDnsEntry))).once();
    });
});