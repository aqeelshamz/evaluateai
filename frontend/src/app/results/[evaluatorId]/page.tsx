"use client";
import { MainContext } from '@/context/context';
import { useParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

export default function Results() {
    const { evaluatorId } = useParams();
    const {
        getResults
    } = useContext(MainContext);

    useEffect(() => {
        getResults(evaluatorId);
    }, [evaluatorId]);

    return (
        <main className="w-screen h-screen bg-base-100 flex flex-col p-2 overflow-hidden">
            {evaluatorId}
            <div className='flex items-center text-lg'><button className='btn btn-square text-lg mr-2' onClick={() => { window.location.href = "/" }}><FiChevronLeft /></button> <p>Results</p></div>
        </main>
    )
}