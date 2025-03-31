import Link from 'next/link';
import { db } from '@/services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { RoomLightweight } from '@/models/room';
import DiscussionRoomsGrid from './DiscussionRoomsGrid';

async function getRooms(): Promise<RoomLightweight[]> {
    try {
        const roomsRef = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsRef);
        const rooms: RoomLightweight[] = [];
        roomsSnapshot.forEach((doc) => {
            const data = doc.data();
            rooms.push({
                id: doc.id,
                title: data.title,
                creatorUsername: data.creatorUsername,
                creationDate: data.creationDate,
                status: data.status,
                spectators: data.spectators ? data.spectators.length : 0,
                currentTurn: data.currentTurn,
                creatorStance: data.creatorStance,
                participantAgainstPhotoUrl: data.participantAgainstPhotoUrl,
                participantForPhotoUrl: data.participantForPhotoUrl,
            });
        });
        return rooms;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
}

export default async function Home() {
    const rooms = await getRooms();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <section className="flex flex-col items-center  py-12 flex-grow w-full">
                <h2 className="text-4xl font-extrabold  mb-4">Welcome!</h2>
                <div className="text-lg text-gray-300 mb-4">
                    Create a discussion room to engage in thought-provoking debates.
                </div>

                <div className="flex space-x-4">
                    <Link
                        href="/create-room"
                        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Create Room
                    </Link>
                </div>

                <div className="mt-16 flex flex-col w-full ">
                    <div className="mb-8">
                        <h2>Browse Discussion Rooms </h2>
                    </div>
                    <DiscussionRoomsGrid rooms={rooms} />
                </div>
            </section>
        </div>
    );
}
