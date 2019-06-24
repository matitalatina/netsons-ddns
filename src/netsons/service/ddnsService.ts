import { Config } from './../../config/config';
import { IpService } from './ipService';
import { DomainService } from './domainService';

export class DdnsService {
    constructor(
        private config: Config,
        private ipService: IpService,
        private domainService: DomainService,
    ) { }

    async keepDdnsUpdated(): Promise<void> {
        const name = this.config.getDnsEntryName();
        const content = await this.ipService.getPublicIp();
        const dnsEntry: IDnsUpdate = {
            name,
            content,
            type: 'A',
            ttl: 300,
        };

        await this.domainService.keepDnsUpdated(dnsEntry);
    }
}