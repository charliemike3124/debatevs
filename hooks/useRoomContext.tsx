'use client';

import roomContext from '@/providers/roomProvider/roomContext';
import { useContext } from 'react';

export default function useRoomContext() {
    return useContext(roomContext);
}
