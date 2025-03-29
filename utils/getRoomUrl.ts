import { Url } from 'next/dist/shared/lib/router/router';

export default function getRoomUrl(id: string): Url {
    return `/room/${id}`;
}
