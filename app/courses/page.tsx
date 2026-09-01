import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const allCourses = await db.select().from(courses);

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-[#F9F6F0] text-[#1C1917] font-sans">
      <div className="mb-16 mt-8 border-b-4 border-[#1C1917] pb-8">
        
        <Link href="/dashboard" className="mb-8 inline-block">
          <Button variant="link" className="text-[#8A3A32] font-bold tracking-widest uppercase text-sm p-0 hover:text-[#1C1917] rounded-none">
            ◄ Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-5xl font-black tracking-tight text-[#8A3A32] uppercase mb-4">
          Curriculum
        </h1>
        <p className="text-[#1C1917] text-lg font-medium tracking-wide">
          Select a discipline to begin your coursework.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {allCourses.map((course) => (
          <div key={course.id} className="bg-white border-4 border-[#1C1917] p-6 shadow-[8px_8px_0_#1C1917] hover:-translate-y-1 hover:shadow-[12px_12px_0_#1C1917] transition-all duration-200 flex flex-col rounded-none">
            
            <h2 className="text-2xl font-black mb-4 uppercase text-[#1C1917]">{course.title}</h2>
            <div className="h-1 w-12 bg-[#8A3A32] mb-4"></div>
            
            <p className="text-[#1C1917] mb-10 grow font-medium leading-relaxed">
              {course.description || "No description provided."}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-[#1C1917]">
              <span className="font-black text-2xl text-[#1C1917]">
                ₹{course.price}
              </span>
              <Link href={`/courses/${course.id}`}>
                <Button className="bg-[#8A3A32] text-[#F9F6F0] px-6 py-5 rounded-none border-2 border-[#1C1917] hover:bg-[#1C1917] transition-colors font-bold uppercase tracking-wider text-sm shadow-none">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}