import { Stance } from './room';
import { Timestamp, FieldValue } from 'firebase/firestore';

interface ChatMessage {
    id: string;
    senderId: string;
    senderUsername: string;
    text: string;
    timestamp: Timestamp;
    stance: Stance;
}

export type { ChatMessage };
