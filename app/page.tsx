import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center font-sans p-8">
      <div className="bg-[#1C1917] border-4 border-[#8A3A32] shadow-[16px_16px_0_#8A3A32] max-w-2xl w-full p-12 md:p-20 text-center">
        
        {/* Decorative Element */}
        <div className="w-16 h-16 bg-[#D4A373] border-4 border-[#F9F6F0] mx-auto mb-10 transform rotate-45"></div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[#F9F6F0] uppercase tracking-tighter mb-6">
          Tattvera
        </h1>
        
        <p className="text-[#F9F6F0] opacity-90 text-lg md:text-xl font-medium tracking-wide mb-12 uppercase">
          A Modern Platform for Higher Curriculum
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/courses">
            <Button className="bg-[#8A3A32] text-[#F9F6F0] px-10 py-8 rounded-none border-4 border-[#F9F6F0] font-black uppercase tracking-widest text-lg hover:bg-[#F9F6F0] hover:text-[#1C1917] hover:border-[#1C1917] transition-all shadow-none w-full sm:w-auto">
              Explore Curriculum
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="bg-transparent text-[#F9F6F0] px-10 py-8 rounded-none border-4 border-[#F9F6F0] font-black uppercase tracking-widest text-lg hover:bg-[#D4A373] hover:text-[#1C1917] hover:border-[#1C1917] transition-all shadow-none w-full sm:w-auto">
              Student Login
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}