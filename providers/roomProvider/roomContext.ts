'use client';

import { Room } from '@/models/room';
import { User } from '@firebase/auth';
import { createContext, Dispatch, SetStateAction } from 'react';

interface context {
    room: Room | null;
    user: User | null;
    hasDiscussionStarted: Boolean;
    setUser: Dispatch<SetStateAction<User | null>>;
    setRoom: Dispatch<SetStateAction<Room | null>>;
    setHasDiscussionStarted: Dispatch<SetStateAction<Boolean>>;
}

const roomContextState: context = {
    room: null,
    user: null,
    hasDiscussionStarted: false,
    setRoom: () => {},
    setUser: () => {},
    setHasDiscussionStarted: () => {},
};

export default createContext<context>(roomContextState);
