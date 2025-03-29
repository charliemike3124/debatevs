import { Stance } from '@/models/room';
import { ChangeEvent, FormEvent } from 'react';

interface CreateRoomFormProps {
    title: string;
    stance: Stance;
    onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onStanceChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (event: FormEvent) => void;
}

export default function CreateRoomForm({
    title,
    stance,
    onTitleChange,
    onStanceChange,
    onSubmit,
}: CreateRoomFormProps) {
    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
                    Debate Topic:
                </label>
                <input
                    type="text"
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none "
                    placeholder="Enter the topic of discussion"
                    value={title}
                    onChange={onTitleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="stance" className="block text-gray-300 text-sm font-bold mb-2">
                    Your Stance:
                </label>
                <select
                    id="stance"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none "
                    value={stance}
                    onChange={onStanceChange}
                >
                    <option className="text-gray-700" value="for">
                        For
                    </option>
                    <option className="text-gray-700" value="against">
                        Against
                    </option>
                </select>
            </div>

            <div className="flex justify-center mt-8">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none "
                >
                    Create Room
                </button>
            </div>
        </form>
    );
}
