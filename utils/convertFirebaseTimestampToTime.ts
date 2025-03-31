import { FieldValue, Timestamp } from '@firebase/firestore';

export default function formatTimestamp(timestamp: Timestamp) {
    const date = timestamp.toDate();
    const now = new Date();

    const todayStr = now.toISOString().split('T')[0];
    const dateStr = date.toISOString().split('T')[0];

    const timeDiff = now.getTime() - date.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(daysAgo / 365);

    if (dateStr === todayStr) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } else if (daysAgo === 1) {
        return 'Yesterday';
    } else if (daysAgo < 30) {
        return `${daysAgo} days ago`;
    } else if (daysAgo < 365) {
        return `${monthsAgo} months ago`;
    } else {
        return `${yearsAgo} years ago`;
    }
}
