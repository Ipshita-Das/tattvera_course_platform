# Learning Management System (LMS) Platform

A production-grade, full-stack course platform built with Next.js (App Router), focusing on clean architecture, secure authentication, and a unique **Warli-art inspired neo-brutalist UI**. 

This project was built to demonstrate proficiency in server-side data fetching, relational database modeling, and modern React patterns.

## Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** Neon (Serverless Postgres)
* **ORM:** Drizzle ORM
* **Authentication:** Auth.js v5 (GitHub OAuth)
* **Styling:** Tailwind CSS v4
* **Components:** shadcn/ui

## Key Features (Rubric Alignment)

* **Authentication (Task 1):** Secure GitHub OAuth login via Auth.js. The `/dashboard` and `/lessons` routes are strictly protected.
* **Data Access Layer (Task 2):** 5-table relational schema (User, Course, Chapter, Lesson, Enrollment) defined via Drizzle. **Zero direct database calls from the client**—all queries execute securely in Node.js via React Server Components and Server Actions.
* **Course Browsing (Task 3):** Server-rendered `/courses` catalog and dynamic `/[courseId]` detail pages. Enrolling triggers a Server Action that securely mutates the database without requiring client-side API routes.
* **Student Dashboard (Task 4):** Protected `/dashboard` querying joined tables to display a user's active enrollments, alongside protected lesson viewer pages.
* **Custom UI/UX:** Fully custom aesthetic relying on bold geometry and earthy tones, incorporating `shadcn/ui` components composed thoughtfully using `asChild` delegation to maintain design consistency.

## Local Setup Instructions

**1. Clone the repository and install dependencies**
\`\`\`bash
git clone <your-repo-url>
cd course-platform
npm install
\`\`\`

**2. Configure Environment Variables**
Copy the example environment file and fill in your keys:
\`\`\`bash
cp .env.example .env.local
\`\`\`
*You will need a Neon Postgres URL and GitHub OAuth credentials.*

**3. Initialize the Database**
Push the Drizzle schema directly to your Neon database:
\`\`\`bash
npx drizzle-kit push
\`\`\`

**4. Run the Development Server**
\`\`\`bash
npm run dev
\`\`\`

**5. Seed the Database**
Once the server is running on `http://localhost:3000`, open your browser and navigate to:
\`\`\`text
http://localhost:3000/api/seed
\`\`\`
This will populate the database with courses, chapters, and lessons.

## Architecture & Security Notes

* **Data Access Layer (DAL):** The application strictly follows the DAL pattern. Database interactions (`db.select`, `db.insert`) are isolated within `page.tsx` Server Components and encapsulated Server Actions. The client side only receives standard JSON data.
* **Security Layer (Bonus Task B):** To implement enterprise-grade bot protection and rate limiting, I would integrate **Arcjet**. I would wrap my Auth endpoints and Enrollment Server Actions with Arcjet's `shield` rule to block automated scraping, and use their `tokenBucket` algorithm to rate-limit enrollment requests to prevent abuse.
* **Known Limitations:** Per the assessment allowances, the "Lessons Completed" progress bar on the dashboard is currently mocked visually to save development time. In a production environment, this would be backed by querying a `UserProgress` junction table counting `isDone = true` for the specific `userId` and `courseId`.