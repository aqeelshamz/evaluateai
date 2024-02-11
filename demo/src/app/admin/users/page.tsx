"use client";
import Link from 'next/link';
import { FiUser, FiUsers } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const [users, setUsers] = useState<any>([]);

    const getUsers = async () => {
        setUsers([
            {
                "_id": "65c88f328ad115825aa80fdb",
                "name": "User",
                "email": "user@evaluateai.com",
                "type": 1,
                "limits": {
                    "_id": "65c88f328ad115825aa80fdd",
                    "userId": "65c88f328ad115825aa80fdb",
                    "evaluatorLimit": 4,
                    "evaluationLimit": 100,
                    "createdAt": "2024-02-11T09:11:14.886Z",
                    "updatedAt": "2024-02-11T09:18:39.539Z",
                    "__v": 0
                },
                "purchases": 1
            },
            {
                "_id": "65c88c79da46d0601e26bebc",
                "name": "Admin",
                "email": "admin@evaluateai.com",
                "type": 0,
                "limits": {
                    "_id": "65c88c79da46d0601e26bebe",
                    "userId": "65c88c79da46d0601e26bebc",
                    "evaluatorLimit": 2,
                    "evaluationLimit": 5,
                    "createdAt": "2024-02-11T08:59:37.049Z",
                    "updatedAt": "2024-02-11T08:59:37.049Z",
                    "__v": 0
                },
                "purchases": 0
            }
        ]);
    }

    useEffect(() => {
        getUsers();
    }, []);


    return <div className='animate-fade-in-bottom w-full h-full p-4'>
        <p className='font-semibold text-xl flex items-center'><FiUsers className='mr-2' /> Users</p>
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Evaluator Limit</th>
                        <th>Evaluation Limit</th>
                        <th>Purchases</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user: any, index: number) => {
                            return <tr key={index}>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar placeholder mr-2">
                                            <div className="bg-blue-700 text-white mask mask-squircle w-10">
                                                <span><FiUser /></span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user?.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <Link href={`mailto:${user?.email}`} target='_blank' className='underline'>{user?.email}</Link>
                                </td>
                                <td>{user?.limits?.evaluatorLimit}</td>
                                <td>{user?.limits?.evaluationLimit}</td>
                                <td>{user?.purchases}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}