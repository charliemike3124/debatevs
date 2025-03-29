import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
    isActive: boolean;
    children: ReactNode;
    width?: string;
    height?: string;
    onClose: () => void;
}

export default function Modal({ isActive, children, width = '90%', height = '90%', onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (isActive) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isActive]);

    return (
        <dialog
            ref={dialogRef}
            className="rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white justify-self-center self-center relative"
            style={{ width: width, height: height }}
            onClose={onClose}
        >
            <button className="absolute top-2 right-2 opacity-90" onClick={() => dialogRef.current?.close()}>
                ✖
            </button>
            <div className="p-4">{children}</div>
        </dialog>
    );
}
