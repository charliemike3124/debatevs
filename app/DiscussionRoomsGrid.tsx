import Link from 'next/link';
import { RoomLightweight, Stance, Status } from '@/models/room';
import getRoomUrl from '@/utils/getRoomUrl';
import '@/app/styles/components/discussion-rooms-grid.scss';
import Avatar from './UI/Avatar';
import { Eye, Users, Calendar } from '@geist-ui/icons';
import convertFirebaseTimestampToTime from '@/utils/convertFirebaseTimestampToTime';
import { Timestamp } from '@firebase/firestore';

interface DiscussionRoomsGridProps {
    rooms: RoomLightweight[];
    filter?: Status;
}

export default function DiscussionRoomsGrid({ rooms, filter }: DiscussionRoomsGridProps) {
    function getParticipantsCount(status: Status) {
        if (status === Status.open) return '1/2';
        else if (status === Status.in_progress) return '2/2';
        else if (status === Status.in_review) return 'In review';
        else return 'closed';
    }

    return rooms.length > 0 ? (
        <div className="grid">
            {rooms.map((room) => (
                <Link href={getRoomUrl(room.id)} key={room.id}>
                    <div key={room.id} className="card">
                        <div className="flex gap-1">
                            <Avatar
                                photoURL={
                                    room.creatorStance === Stance.for
                                        ? room.participantForPhotoUrl
                                        : room.participantAgainstPhotoUrl
                                }
                            />
                            <div>
                                {room.creatorUsername} is <strong> {Stance[room.creatorStance]}</strong>:
                                <h3>
                                    <strong>{room.title}</strong>
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Users size={14} /> {getParticipantsCount(room.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={14} /> {room.spectators.toString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {convertFirebaseTimestampToTime(room.creationDate as Timestamp)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    ) : (
        <span>No rooms to display</span>
    );
}
