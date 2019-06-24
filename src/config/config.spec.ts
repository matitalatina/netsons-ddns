import { Config, NETSONS_EMAIL_ENV, NETSONS_PASSWORD_ENV, NETSONS_DOMAIN_ID_ENV, NETSONS_DNS_ENTRY_NAME_ENV } from './config';
let config: Config;

describe('Config', () => {
    beforeEach(() => {
      config = new Config();
    });

    it('should get email from env', () => {
        const oldEmail = process.env[NETSONS_EMAIL_ENV];
        const mockedEmail = 'email@email.it';

        process.env[NETSONS_EMAIL_ENV] = mockedEmail;
        expect(config.getEmail()).toEqual(mockedEmail);

        process.env[NETSONS_EMAIL_ENV] = oldEmail;
    });

    it('should get password from env', () => {
        const oldPassword = process.env[NETSONS_PASSWORD_ENV];
        const mockedPassword = 'password';

        process.env[NETSONS_PASSWORD_ENV] = mockedPassword;
        expect(config.getPassword()).toEqual(mockedPassword);

        process.env[NETSONS_PASSWORD_ENV] = oldPassword;
    });

    it('should get domain detail id', () => {
        const oldDomainId = process.env[NETSONS_DOMAIN_ID_ENV];
        const mockedDomainId = 123;

        process.env[NETSONS_DOMAIN_ID_ENV] = `${mockedDomainId}`;
        expect(config.getDomainId()).toEqual(mockedDomainId);

        process.env[NETSONS_DOMAIN_ID_ENV] = oldDomainId;
    });

    it('should get dns entry name', () => {
        const oldDnsEntryName = process.env[NETSONS_DNS_ENTRY_NAME_ENV];
        const mockedDnsEntryName = 'www.example.it';

        process.env[NETSONS_DNS_ENTRY_NAME_ENV] = `${mockedDnsEntryName}`;
        expect(config.getDnsEntryName()).toEqual(mockedDnsEntryName);

        process.env[NETSONS_DNS_ENTRY_NAME_ENV] = oldDnsEntryName;
    })
});