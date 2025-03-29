import { Stance } from './room';

interface ChatMessage {
    id: string;
    senderId: string;
    senderUsername: string;
    text: string;
    timestamp: any;
    stance: Stance;
}

export type { ChatMessage };
