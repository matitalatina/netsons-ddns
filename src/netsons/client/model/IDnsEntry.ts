export interface IDnsUpdate {
    name: string;
    type: string;
    content: string;
    ttl: number;
};

export interface IDnsEntry {
    name: string;
    type: string;
    content: string;
    ttl: number;
    id?: number;
    locked?: string;
    inserted?: string;
};