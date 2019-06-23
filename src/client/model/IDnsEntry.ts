interface IDnsUpdate {
    name: string;
    type: string;
    content: string;
    ttl: number;
};

interface IDnsEntry {
    name: string;
    type: string;
    content: string;
    ttl: number;
    id?: number;
    locked?: string;
    inserted?: string;
};