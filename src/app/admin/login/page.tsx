import Link from "next/link";
import { loginAction } from "./actions";
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="text-sm font-bold text-orange-600">
          ← Back to website
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">Admin sign in</h1>
        <p className="muted mt-2 text-sm">
          Sign in to manage website content and SEO.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            Email or password is incorrect.
          </p>
        )}
        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input
              className="field mt-2"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              className="field mt-2"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
