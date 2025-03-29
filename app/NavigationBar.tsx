'use client';

import '@/app/styles/components/header.scss';
import { auth } from '@/services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import Avatar from '@/app/UI/Avatar';

export default function NavigationBar() {
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (error) {
            console.error('Authentication Error:', error);
        }
    }, [error]);

    async function login() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login Failed:', error);
        }
    }

    return (
        <nav className="nav">
            <div>
                <h2>
                    <a href="/">
                        <strong>Debate Versus Me</strong>
                    </a>
                </h2>
            </div>
            <div>
                {!user ? (
                    <button className="nav-btn" onClick={login}>
                        Login
                    </button>
                ) : (
                    <a href="/edit-profile">
                        <Avatar photoURL={user.photoURL} name={user.displayName} />
                    </a>
                )}
            </div>
        </nav>
    );
}
