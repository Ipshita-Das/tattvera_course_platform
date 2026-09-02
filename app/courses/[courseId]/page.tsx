import { db } from "@/lib/db";
import { courses, chapters, lessons, users, enrollments } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import Stripe from "stripe";

export default async function CourseDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ courseId: string }>,
  searchParams: Promise<{ success?: string, canceled?: string }>
}) {
  const { courseId } = await params;
  const { success, canceled } = await searchParams;
  const session = await auth();

  const courseData = await db.select().from(courses).where(eq(courses.id, courseId));
  if (courseData.length === 0) return notFound(); 
  const course = courseData[0];

  let isEnrolled = false;
  let dbUserId: string | null = null;

  if (session?.user?.email) {
    let dbUser = await db.select().from(users).where(eq(users.email, session.user.email));
    if (dbUser.length === 0) {
      const [newUser] = await db.insert(users).values({
        name: session.user.name || "Student",
        email: session.user.email,
        image: session.user.image,
      }).returning();
      dbUserId = newUser.id;
    } else {
      dbUserId = dbUser[0].id;
    }

    const existingEnrollment = await db.select().from(enrollments).where(
      and(eq(enrollments.userId, dbUserId), eq(enrollments.courseId, course.id))
    );
    if (existingEnrollment.length > 0) isEnrolled = true;
  }

  async function handleCheckout() {
    "use server";
    if (!dbUserId) return;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.APP_URL}/courses/${course.id}?success=true`,
      cancel_url: `${process.env.APP_URL}/courses/${course.id}?canceled=true`,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
              description: course.description || undefined,
            },
            unit_amount: Math.round(course.price * 100), // Stripe expects amounts in paise/cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: dbUserId,
        courseId: course.id,
      },
    });

    redirect(stripeSession.url!);
  }

  const courseChapters = await db.select().from(chapters).where(eq(chapters.courseId, course.id));
  courseChapters.sort((a, b) => a.order - b.order); 
  const allCourseLessons = await db.select().from(lessons);

  return (
    <div className="min-h-screen bg-[#F9F6F0] pb-16 font-sans">
      
      <div className="bg-[#8A3A32] border-b-8 border-[#1C1917] pt-12 pb-20 px-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/courses" className="mb-10 inline-block">
             <Button variant="link" className="text-[#F9F6F0] font-bold tracking-widest uppercase text-sm p-0 hover:text-[#1C1917] rounded-none">
                ◄ Return to Directory
             </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-[#F9F6F0] mb-6 uppercase tracking-tight">{course.title}</h1>
          <p className="text-[#F9F6F0] mb-12 text-xl max-w-2xl font-medium leading-relaxed opacity-90">{course.description}</p>
          
          <div className="flex items-center gap-6">
            <span className="bg-[#F9F6F0] text-[#1C1917] px-6 py-3 border-4 border-[#1C1917] font-black text-2xl shadow-[6px_6px_0_#1C1917]">
              ₹{course.price}
            </span>
            
            {!session ? (
              <Link href="/api/auth/signin">
                <Button className="bg-[#1C1917] text-[#F9F6F0] px-10 py-7 rounded-none border-4 border-[#1C1917] font-bold uppercase tracking-wider hover:bg-[#F9F6F0] hover:text-[#1C1917] transition-colors shadow-[6px_6px_0_#1C1917]">
                  Log in to Enroll
                </Button>
              </Link>
            ) : isEnrolled ? (
              <Link href="#syllabus">
                <Button className="bg-[#E6C9A8] text-[#1C1917] px-10 py-7 rounded-none border-4 border-[#1C1917] font-bold uppercase tracking-wider hover:bg-[#D4A373] transition-colors shadow-[6px_6px_0_#1C1917]">
                  Continue Learning ↓
                </Button>
              </Link>
            ) : (
              <form action={handleCheckout}>
                <Button type="submit" className="bg-[#D4A373] text-[#1C1917] px-10 py-7 rounded-none border-4 border-[#1C1917] font-bold uppercase tracking-wider hover:bg-[#F9F6F0] transition-colors shadow-[6px_6px_0_#1C1917]">
                  Enroll in Course
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Payment Notifications */}
      {success && (
        <div className="bg-green-100 border-l-8 border-green-600 text-green-900 p-6 mb-8 max-w-4xl mx-auto shadow-md">
          <h3 className="font-black text-xl uppercase tracking-wider mb-2">Payment Successful!</h3>
          <p className="font-medium">Welcome to the course. Your enrollment is currently being processed. You will have full access to the lessons momentarily.</p>
        </div>
      )}
      {canceled && (
        <div className="bg-red-100 border-l-8 border-[#8A3A32] text-red-900 p-6 mb-8 max-w-4xl mx-auto shadow-md">
          <h3 className="font-black text-xl uppercase tracking-wider mb-2">Payment Canceled</h3>
          <p className="font-medium">Your checkout session was canceled. You have not been charged.</p>
        </div>
      )}

      <div id="syllabus" className="max-w-4xl mx-auto px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-8 w-8 bg-[#8A3A32] border-4 border-[#1C1917]"></div>
          <h2 className="text-3xl font-black text-[#1C1917] uppercase tracking-wide">Syllabus</h2>
        </div>
        
        <div className="space-y-8">
          {courseChapters.length === 0 ? (
            <p className="text-[#1C1917] font-bold uppercase tracking-widest border-4 border-[#1C1917] p-8 text-center bg-white shadow-[8px_8px_0_#1C1917]">
              Curriculum in development.
            </p>
          ) : (
            courseChapters.map((chapter) => {
              const chapterLessons = allCourseLessons.filter(l => l.chapterId === chapter.id).sort((a, b) => a.order - b.order);
              return (
                <div key={chapter.id} className="bg-white border-4 border-[#1C1917] shadow-[8px_8px_0_#1C1917]">
                  <div className="bg-[#E6C9A8] p-6 border-b-4 border-[#1C1917] flex items-center gap-6">
                    <span className="bg-[#1C1917] text-[#F9F6F0] font-bold px-4 py-1 text-sm tracking-widest uppercase">Module {chapter.order}</span>
                    <h3 className="font-black text-xl text-[#1C1917] uppercase">{chapter.title}</h3>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-6">
                      {chapterLessons.map((lesson) => (
                        <li key={lesson.id}>
                          {isEnrolled ? (
                            <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="flex items-center gap-6 text-[#1C1917] p-3 hover:bg-[#F9F6F0] transition-colors border-4 border-transparent hover:border-[#1C1917]">
                              <div className={`w-10 h-10 border-4 border-[#1C1917] flex items-center justify-center font-black ${lesson.isDone ? 'bg-[#8A3A32] text-[#F9F6F0]' : 'bg-[#D4A373]'}`}>
                                {lesson.isDone ? '✓' : lesson.order}
                              </div>
                              <span className="font-bold text-lg uppercase tracking-wide text-[#1C1917]">
                                {lesson.title}
                                {lesson.isDone && <span className="ml-3 text-sm font-black text-[#8A3A32] tracking-widest">(COMPLETED)</span>}
                              </span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-6 text-[#1C1917] p-3">
                              <div className="w-10 h-10 border-4 border-gray-300 text-gray-400 flex items-center justify-center font-black">▲</div>
                              <span className="font-bold text-lg uppercase tracking-wide text-gray-400">{lesson.title} </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}