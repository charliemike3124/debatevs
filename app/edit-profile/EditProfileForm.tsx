import { ChangeEvent, FormEvent } from 'react';

interface EditProfileFormProps {
    name: string | '';
    onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent) => void;
    onLogout: Function;
}

export default function EditPorifleForm({ name, onNameChange, onSubmit, onLogout }: EditProfileFormProps) {
    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                    Display Name:
                </label>
                <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none "
                    placeholder="Enter display name"
                    value={name}
                    onChange={onNameChange}
                    required
                />
            </div>
        </form>
    );
}
