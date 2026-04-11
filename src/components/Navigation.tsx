"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-[80] backdrop-blur-md bg-white/80">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <Image src="/logo.png" alt="CodingCanvas Logo" width={36} height={36} className="rounded-lg" />
        <span className="font-black text-2xl tracking-tighter text-foreground">CodingCanvas</span>
      </Link>
      
      <div className="hidden md:flex gap-10 items-center font-bold text-gray-500">
        <Link href="/" className={`hover:text-cc-primary transition-colors ${pathname === '/' ? 'text-cc-primary' : ''}`}>Home</Link>
        <Link href="/admin" className={`hover:text-cc-primary transition-colors ${pathname.includes('/admin') ? 'text-cc-primary' : ''}`}>Main Host Portal (Admin)</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/login" className="hidden sm:block font-bold text-gray-400 hover:text-foreground transition-colors mr-2">
          Log In
        </Link>
        <Link href="/#book" className="px-6 py-3 rounded-full font-bold text-white bg-cc-primary hover:bg-cc-primary/90 shadow-lg shadow-cc-primary/20 transition-all text-sm md:text-base text-center inline-block">
          Book Free Class
        </Link>
      </div>
    </nav>
  );
}
