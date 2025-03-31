'use client';

import EditPorifleForm from './EditProfileForm';
import { auth } from '@/services/firebase';
import { useState, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export default function EditProfile() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState(user?.displayName || '');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        // TODO: Implement your form submission logic here (e.g., send data to Firebase)
    }

    async function logout() {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <section className="flex flex-col gap-10">
                <div>
                    <h1 className="mb-8">Edit your Info</h1>
                    <EditPorifleForm
                        name={name}
                        onNameChange={(e) => setName(e.target.value)}
                        onLogout={logout}
                        onSubmit={handleSubmit}
                    />
                </div>

                <div>
                    <button className="btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </section>
        </div>
    );
}
