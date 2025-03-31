'use client';

import { JSX, useState } from 'react';

import roomContext from './roomContext';
import { Room } from '@/models/room';
import { User } from '@firebase/auth';

interface props {
    children: JSX.Element;
}

export default function RoomProvider({ children }: props) {
    const [room, setRoom] = useState<Room | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [hasDiscussionStarted, setHasDiscussionStarted] = useState<Boolean>(false);

    return (
        <roomContext.Provider value={{ room, user, hasDiscussionStarted, setHasDiscussionStarted, setRoom, setUser }}>
            {children}
        </roomContext.Provider>
    );
}
