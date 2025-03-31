'use client';

import useRoomContext from '@/hooks/useRoomContext';
import { useEffect, useState } from 'react';
import { START_TURN_DELAY } from '@/constants/settings';

export default function DiscussionTimer() {
    const { hasDiscussionStarted } = useRoomContext();
    const [count, setCount] = useState<number>(START_TURN_DELAY / 1000);

    useEffect(() => {
        if (!hasDiscussionStarted) return;

        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [hasDiscussionStarted]);

    if (!hasDiscussionStarted || count === 0) return null;

    return (
        <div>
            <span>This discussion will start in {count}...</span>
        </div>
    );
}
