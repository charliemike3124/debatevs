'use client';

import Link from 'next/link';
import { RoomLightweight } from '@/models/room';
import getRoomUrl from '@/utils/getRoomUrl';
import '@/app/styles/components/discussion-rooms-grid.scss';

interface DiscussionRoomsGridProps {
    rooms: RoomLightweight[];
}

export default function DiscussionRoomsGrid({ rooms }: DiscussionRoomsGridProps) {
    return rooms.length > 0 ? (
        <div className="grid">
            {rooms.map((room) => (
                <Link href={getRoomUrl(room.id)} key={room.id}>
                    <div key={room.id} className="card">
                        <p>Topic of Discussion: {room.title}</p>
                        <p>Creator: {room.creatorUsername}</p>
                        <p>Status: {room.status}</p>
                        <p>Spectators: {room.spectators.toString()}</p>
                        <p>Current Turn: {room.currentTurn}</p>
                        <p>Creator's Stance: {room.creatorStance}</p>
                    </div>
                </Link>
            ))}
        </div>
    ) : (
        <span> No rooms to display</span>
    );
}
