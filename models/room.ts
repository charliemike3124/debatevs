import { FieldValue, Timestamp } from 'firebase/firestore';
import { ChatMessage } from './chat';

interface Room {
    id: string;
    title: string;
    creatorId: string;
    creatorUsername: string;
    creationDate: Timestamp | FieldValue;
    status: Status;
    creatorStance: Stance;
    participantForId: string | null;
    participantAgainstId: string | null;
    participantForPhotoUrl: string | null;
    participantAgainstPhotoUrl: string | null;
    spectators: User[];
    currentTurn: Stance;
    turnStartTime: Timestamp | null;
    pointsFor: number;
    pointsAgainst: number;
    submissionTime: Timestamp | null;
    winnerId: string | null;
    messages: ChatMessage[];
}

interface RoomLightweight {
    id: string;
    title: string;
    creatorUsername: string;
    creationDate: Timestamp | FieldValue;
    spectators: string[];
    currentTurn: Stance;
    creatorStance: Stance;
    status: Status;
    participantAgainstPhotoUrl: string | null;
    participantForPhotoUrl: string | null;
}

interface User {
    id: string | null;
    name: string | null;
    photoUrl: string | null;
}

enum Status {
    'open',
    'in_progress',
    'in_review',
    'completed',
}
enum Stance {
    'for',
    'against',
}

export type { Room, RoomLightweight, User };

export { Status, Stance };
