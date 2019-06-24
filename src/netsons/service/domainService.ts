import { Config } from './../../config/config';
import { DomainExtractor } from './../client/extractors/domainExtractor';
import { NetsonsClient } from './../client/netsonsClient';

export class DomainService {
    constructor(
        private config: Config,
        private netsonsClient: NetsonsClient,
        private domainExtractor: DomainExtractor,
    ) {}

    async keepDnsUpdated(updatedEntry: IDnsUpdate): Promise<void> {
        const domainId = this.config.getDomainId();
        const email = this.config.getEmail();
        const password = this.config.getPassword();

        await this.netsonsClient.login(email, password);
        const domainHtml = await this.netsonsClient.getDomainPage(domainId);
        const oldDnsEntry = this.domainExtractor
            .fromHtml(domainHtml)
            .find(e => e.name === updatedEntry.name);
        if (!oldDnsEntry) {
            throw new Error('Old DNS entry not found...');
        }
        await this.netsonsClient.updateDomainEntry(domainId, oldDnsEntry, updatedEntry);
    }
}