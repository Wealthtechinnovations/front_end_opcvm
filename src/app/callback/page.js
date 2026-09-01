"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        router.push('/panel/portfolio/login');
    }, [router]);

    return <div>Redirection...</div>;
}
