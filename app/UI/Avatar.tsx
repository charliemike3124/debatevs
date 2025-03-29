import '@/app/styles/components/avatar.scss';

interface AvatarProps {
    photoURL: string | null;
    name?: string | null;
    nameClass?: string;
}

export default function Avatar({ photoURL, name = null, nameClass = '' }: AvatarProps) {
    return (
        <div className="avatar">
            <img src={photoURL || ''} /> <span className={nameClass}>{name}</span>
        </div>
    );
}
