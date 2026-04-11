"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="flex justify-between items-center p-6 bg-cc-surface-lowest shadow-[0_4px_32px_rgba(22,29,31,0.06)] sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="CodingCanvas Logo" width={44} height={44} className="rounded-xl" />
        <span className="font-bold text-2xl text-cc-secondary tracking-tight">CodingCanvas</span>
      </div>
      
      <div className="flex gap-8 items-center font-medium text-lg">
        <Link href="/" className={`hover:text-cc-primary transition-colors ${pathname === '/' ? 'text-cc-primary' : 'text-cc-secondary'}`}>Home</Link>
        <Link href="/blocks" className={`hover:text-cc-primary transition-colors ${pathname === '/blocks' ? 'text-cc-primary' : 'text-cc-secondary'}`}>Blocks to Python</Link>
        <Link href="/student" className={`hover:text-cc-primary transition-colors ${pathname.includes('/student') ? 'text-cc-primary' : 'text-cc-secondary'}`}>Student</Link>
        <Link href="/teacher" className={`hover:text-cc-primary transition-colors ${pathname.includes('/teacher') ? 'text-cc-primary' : 'text-cc-secondary'}`}>Teacher</Link>
      </div>

      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 rounded-full font-bold text-cc-secondary bg-cc-surface-low hover:bg-cc-surface transition-colors flex items-center justify-center">
          Log In
        </Link>
        <button className="px-6 py-2 rounded-full font-bold text-white bg-gradient-to-tr from-cc-primary to-[#ff8c7a] hover:brightness-110 shadow-lg shadow-cc-primary/30 transition-all">
          Book Free Class
        </button>
      </div>
    </nav>
  );
}
