
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    // GANTI KODE SVG DI DALAM SINI DENGAN KODE SVG LOGO KAMU
    // Pastikan menghapus width/height bawaan SVG kamu dan gunakan className untuk ukurannya
    // Gunakan 'currentColor' pada fill atau stroke agar warna mengikuti text-color parent
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {/* Contoh Logo Bawaan (Hapus ini dan ganti dengan path logo kamu) */}
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};
