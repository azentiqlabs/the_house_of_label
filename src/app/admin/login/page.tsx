import Link from "next/link";
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="text-sm font-bold text-orange-600">
          ← Back to website
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">Admin sign in</h1>
        <p className="muted mt-2 text-sm leading-6">
          This is the login screen placeholder. Authentication must be
          implemented and verified before using the admin area in production.
        </p>
        <form className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input
              className="field mt-2"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              className="field mt-2"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
            />
          </label>
          <button type="button" className="btn btn-primary w-full" disabled>
            Sign in (authentication not connected)
          </button>
        </form>
      </div>
    </main>
  );
}
