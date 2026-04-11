"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  // Hide navigation on portal pages and login
  const isInternalPage = pathname?.startsWith('/admin') || 
                         pathname?.startsWith('/teacher') || 
                         pathname?.startsWith('/student') || 
                         pathname?.startsWith('/login') ||
                         pathname?.startsWith('/meeting');

  if (isInternalPage) return null;

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-[80] backdrop-blur-md bg-white/80">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <Image src="/logo.png" alt="CodingCanvas Logo" width={36} height={36} className="rounded-lg" />
        <span className="font-black text-2xl tracking-tighter text-foreground">CodingCanvas</span>
      </Link>
      
      <div className="hidden md:flex gap-10 items-center font-bold text-gray-500">
        <Link href="/" className={`hover:text-cc-primary transition-colors ${pathname === '/' ? 'text-cc-primary' : ''}`}>Home</Link>
        <Link href="#how-it-works" className="hover:text-cc-primary transition-colors">How It Works</Link>
        <Link href="#curriculum" className="hover:text-cc-primary transition-colors">Curriculum</Link>
        <Link href="#pricing" className="hover:text-cc-primary transition-colors">Pricing</Link>
        <Link href="#teachers" className="hover:text-cc-primary transition-colors">Teachers</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/#book" className="px-6 py-3 rounded-full font-bold text-white bg-cc-primary hover:bg-cc-primary/90 shadow-lg shadow-cc-primary/20 transition-all text-sm md:text-base text-center inline-block">
          Book Free Class
        </Link>
      </div>
    </nav>
  );
}
