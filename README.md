# Tattvera Course Platform (LMS)

A production-grade, full-stack course platform built with Next.js (App Router), focusing on clean architecture, secure authentication, scalable payment infrastructure, and a unique **Warli-art inspired neo-brutalist UI**. 

This project was built to demonstrate proficiency in server-side data fetching, relational database modeling, external API webhooks, and modern React patterns.

### Project Links
* **Live Deployment:** https://tattvera-course-platform.vercel.app/
* **Video Walkthrough:** Video 1 - https://www.loom.com/share/233547b3e8794d858ba00dcea4192c75 , Video 2 - https://www.loom.com/share/9be4a9ee6f644a97bc5700535c3574d1

---

## Tech Stack

* **Framework:** Next.js 16.3 (App Router)
* **Language:** TypeScript
* **Database:** Neon (Serverless Postgres)
* **ORM:** Drizzle ORM
* **Authentication:** Auth.js v5 (GitHub OAuth)
* **Payments:** Stripe (Checkout Sessions & Webhooks)
* **Styling:** Tailwind CSS v4
* **Components:** shadcn/ui

---

## Key Features & Architecture

* **Authentication (Task 1):** Secure GitHub OAuth login via Auth.js. Protected routes intercept unauthenticated users attempting to access course material or checkouts.
* **Data Access Layer (Task 2):** 5-table relational schema (User, Course, Chapter, Lesson, Enrollment) defined via Drizzle. **Zero direct database calls from the client**—all queries execute securely in Node.js via React Server Components.
* **Secure Payment Pipeline (Task 3):** 
  * Checkout sessions are generated strictly on the backend using `"use server"` Server Actions, preventing malicious client-side price manipulation.
  * A robust webhook endpoint (`/api/webhooks/stripe`) listens for the `checkout.session.completed` event.
  * The webhook securely validates cryptographic signatures (`Stripe-Signature`) before mutating the Neon database to grant user access.
* **Student Dashboard (Task 4):** Protected UI querying joined tables to display a user's active enrollments and module progress.
* **Custom UI/UX:** Fully custom aesthetic relying on bold geometry and earthy tones, incorporating `shadcn/ui` components composed thoughtfully to maintain design consistency.

---

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
*(You will need a Neon Postgres URL, GitHub OAuth credentials, and Stripe Test keys).*

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

**6. Test Stripe Webhooks Locally (Optional)**
To test the payment flow on your local machine, use the Stripe CLI to forward events to your local server:
\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`
*(Copy the `whsec_...` signing secret provided by the CLI into your `.env.local` file).*

---

## Security Notes & Future Scope

* **Data Encapsulation:** The application strictly follows the DAL pattern. Database interactions (`db.select`, `db.insert`) are isolated within Server Components and Server Actions. The client side only receives standard JSON data.
* **Enterprise Rate Limiting (Bonus Task B):** To implement enterprise-grade bot protection, I would integrate **Arcjet**. Wrapping the Auth endpoints and Enrollment actions with Arcjet's `shield` rule blocks automated scraping, and utilizing their `tokenBucket` algorithm limits checkout spam to prevent abuse.
* **Known Limitations:** Per the assessment allowances, the "Lessons Completed" progress bar on the dashboard is currently mocked visually. In a production environment, this would be backed by querying a `UserProgress` junction table counting `isDone = true` for the specific `userId` and `courseId`.
