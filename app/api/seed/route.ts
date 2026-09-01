import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters, lessons } from "@/lib/schema";

export async function GET() {
  try {
    // --- COURSE 1: AI & MACHINE LEARNING ---
    const [aiCourse] = await db.insert(courses).values({
      title: "Applied AI & Machine Learning",
      description: "Master computer vision, data modeling, and deploying intelligent real-time systems.",
      price: 129.99,
    }).returning();

    const [aiChap1] = await db.insert(chapters).values({ title: "Foundations of ML", courseId: aiCourse.id, order: 1 }).returning();
    await db.insert(lessons).values([
      { title: "Supervised vs Unsupervised Learning", content: "Core concepts of data modeling.", chapterId: aiChap1.id, order: 1 },
      { title: "Neural Network Architectures", content: "Deep dive into hidden layers and weights.", chapterId: aiChap1.id, order: 2 }
    ]);

    const [aiChap2] = await db.insert(chapters).values({ title: "Computer Vision & IoT", courseId: aiCourse.id, order: 2 }).returning();
    await db.insert(lessons).values([
      { title: "Image Processing & Recognition", content: "Working with visual data streams.", chapterId: aiChap2.id, order: 1 },
      { title: "Sensor Fusion Integration", content: "Combining camera data with hardware sensors.", chapterId: aiChap2.id, order: 2 },
      { title: "Edge Computing for AI", content: "Running models locally on embedded devices.", chapterId: aiChap2.id, order: 3 }
    ]);

    // --- COURSE 2: UI/UX DESIGN & FIGMA ---
    const [uiCourse] = await db.insert(courses).values({
      title: "Advanced UI/UX Design",
      description: "Learn layout principles, typography, and master Figma for professional product design.",
      price: 79.99,
    }).returning();

    const [uiChap1] = await db.insert(chapters).values({ title: "Design Principles", courseId: uiCourse.id, order: 1 }).returning();
    await db.insert(lessons).values([
      { title: "Color Theory & Contrast", content: "Creating accessible color palettes.", chapterId: uiChap1.id, order: 1 },
      { title: "Typography in UI", content: "Font pairing and readable hierarchies.", chapterId: uiChap1.id, order: 2 }
    ]);

    const [uiChap2] = await db.insert(chapters).values({ title: "Figma Mastery", courseId: uiCourse.id, order: 2 }).returning();
    await db.insert(lessons).values([
      { title: "Auto Layout Pro Secrets", content: "Building responsive components.", chapterId: uiChap2.id, order: 1 },
      { title: "Components & Variants", content: "Structuring your design system.", chapterId: uiChap2.id, order: 2 },
      { title: "Interactive Prototyping", content: "Connecting screens for user testing.", chapterId: uiChap2.id, order: 3 }
    ]);

    // --- COURSE 3: FRONTEND ENGINEERING ---
    const [feCourse] = await db.insert(courses).values({
      title: "Modern Frontend Engineering",
      description: "Build scalable, high-performance web applications using the latest JavaScript frameworks.",
      price: 99.99,
    }).returning();

    const [feChap1] = await db.insert(chapters).values({ title: "Core Web Technologies", courseId: feCourse.id, order: 1 }).returning();
    await db.insert(lessons).values([
      { title: "Semantic HTML Architecture", content: "Structuring for accessibility.", chapterId: feChap1.id, order: 1 },
      { title: "CSS Grid & Flexbox", content: "Advanced layout techniques.", chapterId: feChap1.id, order: 2 }
    ]);

    const [feChap2] = await db.insert(chapters).values({ title: "Advanced React", courseId: feCourse.id, order: 2 }).returning();
    await db.insert(lessons).values([
      { title: "State Management Strategies", content: "Hooks, Context, and Redux.", chapterId: feChap2.id, order: 1 },
      { title: "Performance Optimization", content: "Memoization and lazy loading.", chapterId: feChap2.id, order: 2 }
    ]);

    return NextResponse.json({ message: "Success! Expanded course catalog added." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to seed database." }, { status: 500 });
  }
}