import publicIp from 'public-ip';

export class IpService {
    async getPublicIp(): Promise<string> {
        return publicIp.v4();
    }
}