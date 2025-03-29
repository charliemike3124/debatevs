'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Room, Stance, Status } from '@/models/room';
import ChatBox from '../ChatBox';
import UserHandler from '../UserHandler';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: PageProps) {
    const { id } = React.use(params);
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!id) return;

        const roomRef = doc(db, 'rooms', id);

        console.log('Subscribing to room:', id);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                setRoom(snapshot.data() as Room);
                console.log('room updated:', snapshot.data());
            } else {
                console.log('Room not found in snapshot!');
            }
        });

        return () => {
            console.log('Unsubscribing from room:', id);
            unsubscribe();
        };
    }, [id]);

    if (!room) {
        return <div className="flex justify-center">Loading...</div>;
    }

    return (
        <section className="flex flex-col items-center h-full">
            <UserHandler
                creatorId={room.creatorId}
                participantAgainstId={room.participantAgainstId}
                participantForId={room.participantForId}
                creatorStance={room.creatorStance}
                roomId={id}
            />

            <div className="w-full flex flex-col grow-1">
                <h1 className="text-center">{room.title}</h1>
                <div className="flex justify-center gap-8">
                    <span>Current Turn: {Stance[room.currentTurn]}</span>
                    <span>Spectators: {room.spectators?.length?.toString() || '0'}</span>
                </div>

                <div className="mt-4 w-full flex grow-1">
                    {room.status === Status.open ? (
                        <div> Waiting for another participant to join the discussion...</div>
                    ) : room.status === Status.in_progress ? (
                        <ChatBox
                            roomId={id}
                            participantForId={room.participantForId}
                            participantForPhotoUrl={room.participantForPhotoUrl}
                            participantAgainstId={room.participantAgainstId}
                            participantAgainstPhotoUrl={room.participantAgainstPhotoUrl}
                            currentTurn={room.currentTurn}
                            messages={room.messages}
                        />
                    ) : room.status === Status.in_review ? (
                        <div>TODO - in review</div>
                    ) : (
                        <div> TODO - completed</div>
                    )}
                </div>
            </div>
        </section>
    );
}
