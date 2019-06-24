import { IpService } from './netsons/service/ipService';
import { DdnsService } from './netsons/service/ddnsService';
import { DomainService } from './netsons/service/domainService';
import { DomainExtractor } from './netsons/client/extractors/domainExtractor';
import fetch from 'node-fetch';
import { NetsonsClient } from './netsons/client/netsonsClient';
import { NetsonsAuth } from './netsons/client/netsonsAuth';
import { Config } from './config/config';
import dotenv from "dotenv";

dotenv.config();

function start() {
    const config = new Config();
    const netsonsAuth = new NetsonsAuth();
    const ipService = new IpService();
    const netsonsClient = new NetsonsClient(fetch, netsonsAuth);
    const domainExtractor = new DomainExtractor();
    const domainService = new DomainService(config, netsonsClient, domainExtractor);
    const ddnsService = new DdnsService(config, ipService, domainService);

    ddnsService
        .keepDdnsUpdated()
        .then(() => console.log('All done!'))
        .catch((e) => console.error(e));
}

start();
