'use client';

import { useEffect, use } from 'react';
import { db, auth } from '@/services/firebase';
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp, DocumentReference } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Room, Stance, Status } from '@/models/room';
import ChatBox from '../ChatBox';
import UserHandler from '../UserHandler';
import Spinner from '@/app/UI/Spinner';
import useRoomContext from '@/hooks/useRoomContext';
import DiscussionTimer from '../DiscussionTimer';
import { START_TURN_DELAY } from '@/constants/settings';
import { QuestionCircle } from '@geist-ui/icons';
import { Tooltip } from '@geist-ui/core';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: PageProps) {
    const { id } = use(params);
    const { room, setRoom, setHasDiscussionStarted } = useRoomContext();
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (!id) return;

        const roomRef = doc(db, 'rooms', id);
        let unsubscribe: (() => void) | null = null;

        const fetchData = async () => {
            unsubscribe = await fetchRoomData(roomRef);
        };

        fetchData();

        return () => {
            console.log('Cleanup - Unsubscribing from room:', id);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [id]);

    async function fetchRoomData(roomRef: DocumentReference) {
        try {
            const roomSnapshot = await getDoc(roomRef);

            if (roomSnapshot.exists()) {
                const roomData = roomSnapshot.data() as Room;

                // If status is "in_progress" or "open", subscribe to real-time updates
                if (roomData.status === Status.in_progress || roomData.status === Status.open) {
                    console.log('Subscribing to room:', id);
                    return subscribeToRoom(roomRef); // Return the unsubscribe function
                } else {
                    console.log('Fetching room once:', id);
                    setRoom(roomData); // Only set room once if status doesn't match
                }
            } else {
                console.log('Room not found!');
            }
        } catch (error) {
            console.error('Error fetching room:', error);
        }

        return null;
    }

    function subscribeToRoom(roomRef: DocumentReference) {
        console.log('Subscribing to room:', id);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const roomData = snapshot.data() as Room;

                const noUpdateNeeded = !roomData.turnStartTime && roomData.status === Status.in_progress;
                console.log('noUpdateNeeded:', noUpdateNeeded);

                if (!noUpdateNeeded) {
                    setRoom(roomData);
                    console.log('room updated:', roomData);
                }

                if (roomData.status === Status.open) {
                    const onParticipantsReady = !!roomData.participantAgainstId && !!roomData.participantForId;

                    if (onParticipantsReady) {
                        console.log('Timer started', user?.uid);
                        setHasDiscussionStarted(true);
                        startTurnTimer();
                    }
                }
            } else {
                console.log('Room not found in snapshot!');
            }
        });

        return unsubscribe;
    }

    function startTurnTimer() {
        setTimeout(() => {
            if (room?.creatorId === user?.uid) {
                const roomRef = doc(db, 'rooms', id);
                updateDoc(roomRef, {
                    turnStartTime: serverTimestamp(),
                    status: Status.in_progress,
                });
            }
        }, START_TURN_DELAY);
    }

    if (!room) {
        return <div className="flex justify-center">Loading...</div>;
    }

    return (
        <section className="flex flex-col items-center h-full">
            <UserHandler roomId={id} />

            <div className="w-full flex flex-col grow-1">
                <h1 className="text-center">{room.title}</h1>
                {room.status === Status.completed ? (
                    <div className="flex justify-center">This discussion has already been completed.</div>
                ) : (
                    <div className="flex justify-center gap-8">
                        <span>Current Turn: {Stance[room.currentTurn]}</span>
                        <span>Spectators: {room.spectators?.length?.toString() || '0'}</span>
                        <Tooltip
                            text={
                                'You can submit this discussion for review. Other users will be able to see the chat and vote for either participant. The first participant to reach 20 votes wins.'
                            }
                        >
                            <span className="flex items-center underline cursor-pointer gap-2">
                                Submit for review <QuestionCircle size={14} />
                            </span>
                        </Tooltip>
                    </div>
                )}

                <DiscussionTimer />

                <div className="mt-4 w-full flex grow-1">
                    {room.status === Status.open ? (
                        <div className="flex justify-center items-center m-auto">
                            <Spinner />{' '}
                            <span className="ml-2">Waiting for another participant to join the discussion...</span>
                        </div>
                    ) : (
                        <ChatBox
                            roomId={id}
                            participantForId={room.participantForId}
                            participantForPhotoUrl={room.participantForPhotoUrl}
                            participantAgainstId={room.participantAgainstId}
                            participantAgainstPhotoUrl={room.participantAgainstPhotoUrl}
                            currentTurn={room.currentTurn}
                            messages={room.messages}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
