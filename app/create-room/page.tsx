'use client';

import { FormEvent, useState } from 'react';
import CreateRoomForm from './CreateRoomForm';
import { db, auth } from '@/services/firebase';
import { collection, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRoomUrl from '@/utils/getRoomUrl';
import { Room, Stance, Status } from '@/models/room';

export default function CreateRoom() {
    const [title, setTitle] = useState<string>('');
    const [stance, setStance] = useState<Stance>(Stance.for);

    const [user, loading, error] = useAuthState(auth);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to create a room.');
            return;
        }

        try {
            const roomsRef = collection(db, 'rooms');
            const newRoomRef = doc(roomsRef);
            const currentTurn = Math.random() < 0.5 ? Stance.for : Stance.against;
            const participantId = user.uid;
            const newRoom: Room = {
                id: newRoomRef.id,
                title: title,
                creatorId: user.uid,
                creatorUsername: user.displayName || 'Anonymous',
                creationDate: new Date(),
                status: Status.open,
                creatorStance: stance,
                participantForId: stance === Stance.for ? participantId : null,
                participantAgainstId: stance === Stance.against ? participantId : null,
                participantForPhotoUrl: stance === Stance.for ? user.photoURL : null,
                participantAgainstPhotoUrl: stance === Stance.against ? user.photoURL : null,
                spectators: [],
                currentTurn: currentTurn,
                turnStartTime: null,
                pointsFor: 0,
                pointsAgainst: 0,
                submissionTime: null,
                winnerId: null,
                messages: [],
            };

            const docRef = await addDoc(roomsRef, newRoom);

            window.location.href = getRoomUrl(docRef.id).toString();
        } catch (error) {
            console.error('Error creating room: ', error);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <section>
                <h2 className="text-2xl font-semibold mb-4 ">Create a Discussion Room</h2>

                <CreateRoomForm
                    title={title}
                    stance={stance}
                    onTitleChange={(e: any) => setTitle(e.target.value)}
                    onStanceChange={(e: any) => setStance(e.target.value)}
                    onSubmit={handleSubmit}
                />
            </section>
        </div>
    );
}
