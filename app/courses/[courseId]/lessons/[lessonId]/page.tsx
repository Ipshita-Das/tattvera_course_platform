import { db } from "@/lib/db";
import { lessons, enrollments, users, courses } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/api/auth/signin");

  const dbUser = await db.select().from(users).where(eq(users.email, session.user.email));
  if (dbUser.length === 0) redirect("/api/auth/signin");
  const userId = dbUser[0].id;

  const enrollment = await db.select().from(enrollments).where(
    and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
  );
  if (enrollment.length === 0) redirect(`/courses/${courseId}`); 

  const lessonData = await db.select().from(lessons).where(eq(lessons.id, lessonId));
  if (lessonData.length === 0) return notFound();
  const lesson = lessonData[0];
  
  const courseData = await db.select().from(courses).where(eq(courses.id, courseId));
  const course = courseData[0];

  async function markComplete() {
    "use server";
    await db.update(lessons).set({ isDone: true }).where(eq(lessons.id, lessonId));
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] p-8 font-sans text-[#1C1917]">
      <div className="max-w-3xl mx-auto mt-10">
        
        <Link href={`/courses/${courseId}`} className="mb-10 inline-block">
           <Button variant="link" className="text-[#8A3A32] font-bold tracking-widest uppercase text-sm p-0 hover:text-[#1C1917] rounded-none">
              ◄ Back to {course.title}
           </Button>
        </Link>
        
        <div className="bg-white border-4 border-[#1C1917] shadow-[12px_12px_0_#1C1917] p-10">
          <div className="mb-8 border-b-4 border-[#1C1917] pb-8">
            <span className="bg-[#E6C9A8] text-[#1C1917] px-4 py-1 border-2 border-[#1C1917] font-bold uppercase tracking-widest text-sm mb-4 inline-block">
              Lesson {lesson.order}
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight mt-4">{lesson.title}</h1>
          </div>
          
          <div className="prose max-w-none mb-16 text-lg font-medium leading-relaxed">
            <p>{lesson.content}</p>
            <div className="h-32 w-full bg-[#F9F6F0] border-4 border-[#1C1917] border-dashed mt-8 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
              [ Video / Interactive Content Placeholder ]
            </div>
          </div>

          <div className="border-t-4 border-[#1C1917] pt-8 flex justify-end">
            {lesson.isDone ? (
              <div className="bg-[#8A3A32] text-[#F9F6F0] px-8 py-4 border-4 border-[#1C1917] font-black uppercase tracking-widest shadow-[6px_6px_0_#1C1917]">
                ✓ Lesson Completed
              </div>
            ) : (
              <form action={markComplete}>
                <Button type="submit" className="bg-[#D4A373] text-[#1C1917] px-8 py-7 rounded-none border-4 border-[#1C1917] font-black uppercase tracking-widest hover:bg-[#F9F6F0] transition-colors shadow-[6px_6px_0_#1C1917]">
                  Mark as Complete
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}