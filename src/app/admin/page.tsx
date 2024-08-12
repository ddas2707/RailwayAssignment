// src/app/admin/page.tsx
import { useState, useEffect } from 'react';
import { PdfLink } from '@/types/pdf';

export default function AdminPage() {
  const [pdfLinks, setPdfLinks] = useState<PdfLink[]>([]);  //noted

  useEffect(() => {
    async function fetchPdfLinks() {
       try{
        const response = await fetch('/api/admin/getPdfLinks');
        const data = await response.json();
        setPdfLinks(data.pdfLinks);
       }catch(error){
        console.error("Failed to fetch the pdf links",error)
       }  
    }

    fetchPdfLinks();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>PDF Links</h2>
      <ul>
        {pdfLinks.map((pdf, index) => (
          <li key={index}>
            <a href={pdf.url} target="_blank" rel="noopener noreferrer">
              {pdf.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
