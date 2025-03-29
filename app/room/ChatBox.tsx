'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/services/firebase';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stance } from '@/models/room';
import { ChatMessage } from '@/models/chat';
import Avatar from '@/app/UI/Avatar';
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
    const [user] = useAuthState(auth); // Get current user
    const messagesEndRef = useRef<HTMLDivElement>(null); // Reference for scrolling to bottom

    const isChatEnabled = participantForId !== null && participantAgainstId !== null;
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
            const timestamp = new Date();

            const newChatMessage: ChatMessage = {
                id: crypto.randomUUID(),
                senderId: user.uid,
                senderUsername: user.displayName || user.email || 'Anonymous',
                text: newMessage,
                timestamp,
                stance: user.uid === participantForId ? Stance.for : Stance.against,
            };

            console.log('sending message and updating room.');
            await updateDoc(roomRef, {
                messages: arrayUnion(newChatMessage),
                currentTurn: currentTurn === Stance.for ? Stance.against : Stance.for,
                turnStartTime: serverTimestamp(),
            });

            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    return (
        <div className="wrapper">
            {isChatEnabled ? (
                <>
                    <div className="h-64 overflow-y-scroll message-wrapper">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.stance === Stance.for ? 'for' : ' against'}`}>
                                <Avatar
                                    photoURL={
                                        msg.stance === Stance.for ? participantForPhotoUrl : participantAgainstPhotoUrl
                                    }
                                />
                                <div>
                                    <b>
                                        ({Stance[msg.stance]}) {msg.senderUsername}:
                                    </b>{' '}
                                    <div className="text-wrap">{msg.text}</div>
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
                    ) : (
                        <div className="p-4">It's not your turn to chat.</div>
                    )}
                </>
            ) : (
                <p>Chat is enabled when two participants join the room.</p>
            )}
        </div>
    );
}
