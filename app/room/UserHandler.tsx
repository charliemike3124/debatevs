'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/services/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Participant, Stance, Status } from '@/models/room';
import Modal from '@/app/UI/Modal';

interface Props {
    creatorId: string;
    participantAgainstId: string | null;
    participantForId: string | null;
    creatorStance: Stance;
    roomId: string;
}
export default function UserHandler({
    creatorId,
    participantAgainstId,
    participantForId,
    creatorStance,
    roomId,
}: Props) {
    const [user, loading, error] = useAuthState(auth);
    const [showParticipantModal, setShowParticipantModal] = useState(false);
    const [participant, setParticipant] = useState<Participant>({ id: null, isSpectator: true, stance: null });
    const [isParticipantSubmitted, setIsParticipantSubmitted] = useState(false);

    useEffect(() => {
        if (isParticipantSubmitted || showParticipantModal) return;

        const isRoomFull = participantAgainstId && participantForId;
        if (!isRoomFull && !!user) {
            const isRoomCreator = user?.uid === creatorId;
            if (isRoomCreator) {
                setParticipant({ id: user?.uid, isSpectator: false, stance: creatorStance });
            } else {
                setShowParticipantModal(true);
            }
        }

        console.log('handleBeforeUnload added');
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user, participantAgainstId, participantForId]);

    async function handleBeforeUnload() {
        try {
            const roomRef = doc(db, 'rooms', roomId);
            let updateData: any = {};

            if (participantForId === user?.uid) {
                updateData.participantForId = null;
            } else if (participantAgainstId === user?.uid) {
                updateData.participantAgainstId = null;
            } else {
                updateData.spectators = arrayRemove(user?.uid);
            }

            if (Object.keys(updateData).length > 0) {
                console.log('user removed');
                await updateDoc(roomRef, updateData);
            }
        } catch (error) {
            console.error('Error removing participant:', error);
        }
    }

    async function submitParticipantForm(e: FormEvent, closeModal = false) {
        e.preventDefault();
        setIsParticipantSubmitted(true);

        if (!user || !roomId) return;

        try {
            const roomRef = doc(db, 'rooms', roomId);

            if (participant.isSpectator) {
                await updateDoc(roomRef, {
                    spectators: arrayUnion(user.uid),
                });
                console.log('Added user to spectators');
            } else {
                let updateData: any = {};
                if (creatorStance === Stance.for) {
                    updateData = { participantAgainstId: user.uid, participantAgainstPhotoUrl: user.photoURL };
                } else {
                    updateData = { participantForId: user.uid, participantForPhotoUrl: user.photoURL };
                }

                console.log('adding new participant:', updateData);

                updateData.status = Status.in_progress;
                await updateDoc(roomRef, updateData);
            }
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room information.');
        } finally {
            if (closeModal) setShowParticipantModal(false);
        }
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
                                    participant.isSpectator
                                        ? 'border px-4 py-2 opacity-50'
                                        : 'bg-blue-500 text-white px-4 py-2'
                                }
                                onClick={() => setParticipant({ ...participant, isSpectator: false })}
                            >
                                Participant
                            </div>
                            <div
                                className={
                                    participant.isSpectator
                                        ? 'bg-blue-500 text-white px-4 py-2'
                                        : 'border px-4 py-2 opacity-50'
                                }
                                onClick={() => setParticipant({ ...participant, isSpectator: true })}
                            >
                                Spectator
                            </div>
                        </div>
                    </div>
                    {participant.isSpectator ? (
                        <div className="my-8"></div>
                    ) : (
                        <div className="my-8">
                            <label htmlFor="stance" className="block text-gray-300 text-sm font-bold mb-2">
                                Your Stance:
                            </label>
                            <input
                                readOnly
                                value={creatorStance === Stance.against ? Stance[Stance.for] : Stance[Stance.against]}
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
