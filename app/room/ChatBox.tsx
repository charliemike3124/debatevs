'use client';

import { useState, useRef, CSSProperties } from 'react';
import { db, auth } from '@/services/firebase';
import { doc, updateDoc, serverTimestamp, arrayUnion, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stance, Status } from '@/models/room';
import { ChatMessage } from '@/models/chat';
import useRoomContext from '@/hooks/useRoomContext';
import Avatar from '@/app/UI/Avatar';
import convertFirebaseTimestampToTime from '@/utils/convertFirebaseTimestampToTime';
import '@/app/styles/components/chat-box.scss';

interface Props {
    currentTurn: Stance;
    roomId: string;
    participantForId: string | null;
    participantForPhotoUrl: string | null;
    participantAgainstId: string | null;
    participantAgainstPhotoUrl: string | null;
    messages: ChatMessage[] | [];
}
export default function Chatbox({
    roomId,
    participantForId,
    participantAgainstId,
    currentTurn,
    messages,
    participantForPhotoUrl,
    participantAgainstPhotoUrl,
}: Props) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [user] = useAuthState(auth);
    const { room } = useRoomContext();

    const isChatEnabled =
        (participantForId !== null && participantAgainstId !== null && room?.turnStartTime) ||
        [Status.completed, Status.in_review].includes(room?.status ?? 0);

    const isMyTurn =
        user &&
        ((currentTurn === Stance.for && user.uid === participantForId) ||
            (currentTurn === Stance.against && user.uid === participantAgainstId));

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !newMessage.trim() || !roomId || !isChatEnabled || !isMyTurn) return;

        try {
            const roomRef = doc(db, 'rooms', roomId);

            const newChatMessage: ChatMessage = {
                id: crypto.randomUUID(),
                senderId: user.uid,
                senderUsername: user.displayName || user.email || 'Anonymous',
                text: newMessage,
                timestamp: Timestamp.now(),
                stance: user.uid === participantForId ? Stance.for : Stance.against,
            };

            const updatedMessages = [...room.messages, newChatMessage];

            console.log('sending message and updating room.');
            await updateDoc(roomRef, {
                messages: updatedMessages,
                currentTurn: currentTurn === Stance.for ? Stance.against : Stance.for,
                turnStartTime: serverTimestamp(),
            });

            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    function getChatBoxStyles(): CSSProperties {
        if (!room) return {};
        return {
            opacity: [Status.completed, Status.in_review].includes(room?.status) ? '0.8' : '1',
        };
    }

    return (
        <div className="wrapper">
            {isChatEnabled ? (
                <>
                    <div className="h-64 overflow-y-scroll message-wrapper" style={getChatBoxStyles()}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.stance === Stance.for ? 'for' : ' against'}`}>
                                <div className="self-start">
                                    <Avatar
                                        photoURL={
                                            msg.stance === Stance.for
                                                ? participantForPhotoUrl
                                                : participantAgainstPhotoUrl
                                        }
                                    />
                                </div>
                                <div>
                                    <b>
                                        ({Stance[msg.stance]}) {msg.senderUsername}:
                                    </b>{' '}
                                    <div className="text-wrap">{msg.text}</div>
                                    <div className="flex justify-end">
                                        {convertFirebaseTimestampToTime(msg.timestamp as Timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    {isMyTurn ? (
                        <form onSubmit={handleSendMessage} className="flex border">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Enter your message..."
                                className="p-2 w-full"
                            />
                            <button type="submit" className="bg-blue-500 text-white  p-2 w-40">
                                Send
                            </button>
                        </form>
                    ) : room.status === Status.in_progress ? (
                        <div className="p-4">It's not your turn to chat.</div>
                    ) : (
                        <div></div>
                    )}
                </>
            ) : room?.status === Status.open ? (
                <div>Chat is enabled when two participants join the room.</div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
