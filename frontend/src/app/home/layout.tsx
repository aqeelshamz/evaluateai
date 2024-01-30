"use client";
import React from 'react';
import Home from './home';
import { Context } from '@/context/context';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<Context><Home>{children}</Home><ToastContainer /></Context>)
}
