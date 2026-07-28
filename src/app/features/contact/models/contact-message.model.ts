export interface ContactMessagePayload {
    name: string;
    phone: string;
    message: string;
}

export interface ContactMessageResult {
    id?: number;
    message?: string;
}
