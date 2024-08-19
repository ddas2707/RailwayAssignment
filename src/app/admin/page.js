"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const AdminPanel = () => {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        // Fetch the list of PDFs from the database
        const fetchPdfs = async () => {
            try {
                const response = await fetch('/api/pdf-list');
                const data = await response.json();
                setPdfs(data.pdfs);
            } catch (error) {
                console.error('Error fetching PDFs:', error);
            }
        };
        fetchPdfs();
    }, []);
    return (
        <div>
            <h1>Admin Panel</h1>
            <ul>
                {pdfs.map((pdf) => (
                    <li key={pdf._id}>
                        {pdf.name} - {pdf.email}
                        <Link href={`/api/pdf/${pdf._id}`}>
                            <a target="_blank" download>
                                <button>Download PDF</button>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
