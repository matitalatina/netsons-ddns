export const NETSONS_EMAIL_ENV = 'NETSONS_EMAIL';
export const NETSONS_PASSWORD_ENV = 'NETSONS_PASSWORD';
export const NETSONS_DOMAIN_ID_ENV = 'NETSONS_DOMAIN_ID';

export class Config {
    getPassword(): string {
        return this.getEnv(NETSONS_PASSWORD_ENV);
    }

    getEmail(): string {
        return this.getEnv(NETSONS_EMAIL_ENV);
    }

    getDomainId(): number {
        return parseInt(this.getEnv(NETSONS_DOMAIN_ID_ENV));
    }

    private getEnv(envKey: string) {
        const value = process.env[envKey];
        if (!value) {
            throw new Error(`${envKey} not configured`);
        }
        return value;
    }
}
