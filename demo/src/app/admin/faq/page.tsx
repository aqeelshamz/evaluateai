"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiHelpCircle, FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Page() {
    const [data, setData] = useState<any>([]);
    const [deleteFaqId, setDeleteFaqId] = useState("");

    const getData = async () => {
        setData([
            {
                "_id": "65c890ef93afbe3c9638eb6d",
                "question": "How does it generate responses?",
                "answer": "EvaluateAI make use of OpenAI’s GPT-4 model for exam answer sheet evaluation and marksheet generation."
            },
            {
                "_id": "65c890ef93afbe3c9638eb62",
                "question": "What if questions and answers span multiple pages?",
                "answer": "Users can upload multiple question papers, answer criteria and student answer sheets. EvaluateAI supports uploading multiple page question papers, answer keys / criteria and multiple answer sheets for each student."
            },
            {
                "_id": "65c890ef93afbe3c9638eb63",
                "question": "How can I contact support?",
                "answer": "You can contact our support team by emailing us at aqeelten@gmail.com"
            },
        ]);
    }

    const deleteFAQ = async () => {
        toast.error("This feature is not available in demo version!");
    }

    useEffect(() => {
        getData();
    }, []);

    return <div className='animate-fade-in-bottom w-full h-full p-4'>
        <p className='font-semibold text-xl flex items-center mb-5'><FiHelpCircle className='mr-2' /> FAQ</p>
        <Link href="/admin/faq/new"><button className='btn btn-primary'>+ New FAQ</button></Link>
        <div className="overflow-x-auto mt-5">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item: any, i: number) => {
                            return <tr key={i} className='hover'>
                                <th>{i + 1}</th>
                                <td>{item?.question}</td>
                                <td>{item?.answer}</td>
                                <td><label onClick={() => setDeleteFaqId(item?._id)} htmlFor='deletefaq_modal' className='btn btn-square btn-outline btn-error'><FiTrash /></label></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        {/* Delete FAQ Modal */}
        <input type="checkbox" id="deletefaq_modal" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete FAQ</h3>
                <p className="py-4">Are you sure want to delete this FAQ?</p>
                <div className="modal-action">
                    <label htmlFor="deletefaq_modal" className="btn">Cancel</label>
                    <label htmlFor="deletefaq_modal" className="btn btn-error" onClick={() => deleteFAQ()}>Delete</label>
                </div>
            </div>
            <label className="modal-backdrop" htmlFor="deletefaq_modal">Cancel</label>
        </div>
    </div>
}