import '@/app/styles/components/spinner.scss';

interface Props {
    size?: number;
    color?: string;
}

export default function Spinner({ size = 16, color = 'white' }: Props) {
    return <span className="spinner" style={{ width: size, height: size, borderColor: color }} />;
}
