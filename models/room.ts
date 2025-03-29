import { Timestamp } from 'firebase/firestore';
import { ChatMessage } from './chat';

interface Room {
    id: string;
    title: string;
    creatorId: string;
    creatorUsername: string;
    creationDate: Date;
    status: Status;
    creatorStance: Stance;
    participantForId: string | null;
    participantAgainstId: string | null;
    participantForPhotoUrl: string | null;
    participantAgainstPhotoUrl: string | null;
    spectators: string[];
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
    creationDate: Date;
    spectators: string[];
    currentTurn: Stance;
    creatorStance: Stance;
    status: Status;
}

interface Participant {
    id: String | null;
    isSpectator: Boolean;
    stance: Stance | null;
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

export type { Room, RoomLightweight, Participant };

export { Status, Stance };
