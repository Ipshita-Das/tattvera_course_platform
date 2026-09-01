import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/dashboard" })
          }}
        >
          <button 
            type="submit" 
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Log in with GitHub
          </button>
        </form>
      </div>
    </div>
  )
}