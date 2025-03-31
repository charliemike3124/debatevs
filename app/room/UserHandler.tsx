'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/services/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, DocumentReference, serverTimestamp } from 'firebase/firestore';
import { Stance, Status, User } from '@/models/room';
import useRoomContext from '@/hooks/useRoomContext';
import Modal from '@/app/UI/Modal';

interface Props {
    roomId: string;
}

export default function UserHandler({ roomId }: Props) {
    const [user] = useAuthState(auth);
    const { room } = useRoomContext();

    const [showParticipantModal, setShowParticipantModal] = useState(false);
    const [isSpectator, setIsSpectator] = useState<Boolean>(true);
    const [isParticipantSubmitted, setIsParticipantSubmitted] = useState(false);

    useEffect(() => {
        console.log(user);
        if (isParticipantSubmitted || showParticipantModal || !room) return;

        const isRoomFull = room?.participantAgainstId && room?.participantForId;
        const isRoomCreator = user?.uid === room?.creatorId;
        if (!isRoomFull && !!user) {
            if (isRoomCreator) {
                setIsSpectator(false);
            } else if ([Status.in_progress, Status.open].includes(room.status)) {
                setShowParticipantModal(true);
            }
        } else if (!isRoomCreator) {
            const roomRef = doc(db, 'rooms', roomId);
            addSpectator(roomRef);
        }

        console.log('handleBeforeUnload added');
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user, room?.participantAgainstId, room?.participantForId]);

    async function handleBeforeUnload() {
        if (!room) return;

        try {
            const roomRef = doc(db, 'rooms', roomId);
            let updateData: any = { status: Status.completed };

            if (room.participantForId === user?.uid) {
                updateData.participantForId = null;
                updateData.winnerId = room.participantAgainstId;
            } else if (room.participantAgainstId === user?.uid) {
                updateData.participantAgainstId = null;
                updateData.winnerId = room.participantForId;
            } else {
                updateData.spectators = arrayRemove(user?.uid);
            }

            await updateDoc(roomRef, updateData);
        } catch (error) {
            console.error('Error removing participant:', error);
        }
    }

    async function submitParticipantForm(e: FormEvent, closeModal = false) {
        e.preventDefault();
        setIsParticipantSubmitted(true);

        if (!user || !room) return;

        try {
            const roomRef = doc(db, 'rooms', roomId);

            if (isSpectator && ![room.participantAgainstId, room.participantForId].includes(user.uid)) {
                addSpectator(roomRef);
            } else {
                let updateData: any = {};
                if (room.creatorStance === Stance.for) {
                    updateData = { participantAgainstId: user.uid, participantAgainstPhotoUrl: user.photoURL };
                } else {
                    updateData = { participantForId: user.uid, participantForPhotoUrl: user.photoURL };
                }

                console.log('adding new participant:', updateData);

                await updateDoc(roomRef, updateData);
            }
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room information.');
        } finally {
            if (closeModal) setShowParticipantModal(false);
        }
    }

    async function addSpectator(roomRef: DocumentReference) {
        const spectatorUser: User = {
            id: user?.uid ?? null,
            name: user?.displayName ?? 'Anonymous',
            photoUrl: user?.photoURL ?? '/anonymous',
        };

        await updateDoc(roomRef, {
            spectators: arrayUnion(spectatorUser),
        });
        console.log('Added user to spectators');
    }

    return (
        <div>
            <Modal
                isActive={showParticipantModal}
                onClose={() => setShowParticipantModal(false)}
                width="250px"
                height="350px"
            >
                <form onSubmit={submitParticipantForm}>
                    <div>
                        <label>Do you want to participate or spectate?</label>
                        <div className="flex gap-2 mt-2">
                            <div
                                className={
                                    isSpectator ? 'border px-4 py-2 opacity-50' : 'bg-blue-500 text-white px-4 py-2'
                                }
                                onClick={() => setIsSpectator(false)}
                            >
                                Participant
                            </div>
                            <div
                                className={
                                    isSpectator ? 'bg-blue-500 text-white px-4 py-2' : 'border px-4 py-2 opacity-50'
                                }
                                onClick={() => setIsSpectator(true)}
                            >
                                Spectator
                            </div>
                        </div>
                    </div>
                    {isSpectator ? (
                        <div className="my-8"></div>
                    ) : (
                        <div className="my-8">
                            <label htmlFor="stance" className="block text-gray-300 text-sm font-bold mb-2">
                                Your Stance:
                            </label>
                            <input
                                readOnly
                                value={
                                    room?.creatorStance === Stance.against ? Stance[Stance.for] : Stance[Stance.against]
                                }
                            />
                        </div>
                    )}

                    <button
                        className="bg-black rounded p-2 border hover:opacity-70 "
                        onClick={(e) => submitParticipantForm(e, true)}
                    >
                        Continue
                    </button>
                </form>
            </Modal>
        </div>
    );
}
