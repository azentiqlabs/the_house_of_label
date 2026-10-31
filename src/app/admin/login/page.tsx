import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Package,
  PanelsTopLeft,
  ShieldCheck,
} from "lucide-react";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3faff] text-[#092f55]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-36 -top-56 h-[560px] w-[560px] rounded-full border border-[#83c8ee]/20 bg-[#dff3fd]/35" />
        <div className="absolute -right-16 -top-36 h-[410px] w-[410px] rounded-full border border-[#83c8ee]/20" />
        <div className="absolute bottom-[-210px] left-[-110px] h-[360px] w-[520px] rounded-[50%] border-t-[18px] border-[#a8dcf5]/20" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-[#d8eaf5] py-4">
          <Link href="/" aria-label="The House of Labels home" className="shrink-0">
            <Image
              src="/theme/THE_HOUSE_OF_LABEL_LOGO02.png"
              alt="The House of Labels"
              width={2048}
              height={260}
              priority
              sizes="(max-width: 640px) 205px, 270px"
              className="h-auto w-[205px] object-contain sm:w-[245px] lg:w-[270px]"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-2 text-[12px] font-semibold text-[#07518a] transition-colors hover:text-[#0876bd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#42a9e6] sm:px-3 sm:text-[13px]"
          >
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.8} />
            <span className="hidden sm:inline">Back to website</span>
            <span className="sm:hidden">Website</span>
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 sm:py-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:py-12 xl:gap-16">
          <aside className="relative hidden min-h-[590px] flex-col justify-between overflow-hidden rounded-[22px] bg-[radial-gradient(ellipse_at_78%_32%,rgba(184,226,250,0.82)_0%,rgba(225,243,253,0.66)_36%,transparent_68%),linear-gradient(120deg,#ffffff_0%,#f3faff_55%,#e4f4fd_100%)] px-9 pb-7 pt-10 md:flex lg:px-10 xl:px-12 xl:pt-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -top-36 h-[440px] w-[440px] rounded-full border border-[#53aee0]/15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-12 top-20 h-[7px] w-[7px] rounded-full bg-[#42a9e6] shadow-[18px_22px_0_0_rgba(66,169,230,.35),-15px_43px_0_0_rgba(66,169,230,.25),30px_65px_0_0_rgba(66,169,230,.2)]"
            />

            <div className="relative z-10 max-w-[510px]">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#0b5a8e]">
                <span className="h-[2px] w-9 bg-[#42a9e6]" />
                Website administration
              </p>
              <h1 className="max-w-[520px] text-[2.55rem] font-extrabold leading-[1.09] tracking-[-0.045em] text-[#092f55] xl:text-[3.25rem]">
                Reliable
                <br />
                <span className="text-[#0876bd]">label solutions.</span>
                <br />
                Clear control.
              </h1>
              <p className="mt-5 max-w-[410px] text-[14px] leading-7 text-[#536f8c] xl:text-[15px]">
                Keep your website up to date, from product information and
                industry pages to customer enquiries and gallery content.
              </p>
            </div>

            <div className="relative z-10 -mx-3 mt-2 flex min-h-[220px] flex-1 items-center justify-center xl:min-h-[250px]">
              <Image
                src="/theme/image14.png"
                alt="Printed and thermal label rolls"
                width={1609}
                height={977}
                priority
                sizes="(max-width: 1280px) 46vw, 540px"
                className="h-auto max-h-[285px] w-full object-contain drop-shadow-[0_15px_18px_rgba(8,63,103,0.08)] xl:max-h-[315px]"
              />
            </div>

            <div className="relative z-10 grid grid-cols-3 rounded-[14px] border border-[#d7eaf6] bg-white/75 px-2 py-4 shadow-[0_8px_28px_rgba(8,63,103,0.04)] backdrop-blur-sm sm:px-4">
              <div className="px-2 sm:px-3">
                <PanelsTopLeft aria-hidden="true" size={18} strokeWidth={1.7} className="mb-2 text-[#0876bd]" />
                <p className="text-[11px] font-bold leading-4 text-[#123653] sm:text-xs">Website pages</p>
              </div>
              <div className="border-l border-[#d8eaf5] px-3">
                <Package aria-hidden="true" size={18} strokeWidth={1.7} className="mb-2 text-[#0876bd]" />
                <p className="text-[11px] font-bold leading-4 text-[#123653] sm:text-xs">Product catalogue</p>
              </div>
              <div className="border-l border-[#d8eaf5] px-3">
                <CheckCircle2 aria-hidden="true" size={18} strokeWidth={1.7} className="mb-2 text-[#0876bd]" />
                <p className="text-[11px] font-bold leading-4 text-[#123653] sm:text-xs">Enquiries</p>
              </div>
            </div>
          </aside>

          <section className="flex w-full items-center justify-center">
            <div className="w-full max-w-[440px] rounded-[18px] border border-[#d8eaf5] bg-white px-6 py-8 shadow-[0_18px_48px_rgba(8,63,103,0.08)] sm:px-9 sm:py-10 lg:px-10">
              <div className="mb-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8eaf5] bg-[#f3faff] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#07518a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0876bd]" />
                  Admin portal
                </div>
                <h2 className="text-[2rem] font-extrabold leading-tight tracking-[-0.045em] text-[#092f55] sm:text-[2.2rem]">
                  Sign in
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-[#536f8c]">
                  Sign in to manage website content, product details and
                  customer enquiries.
                </p>
              </div>

              {error && (
                <div
                  id="login-error"
                  role="alert"
                  aria-live="polite"
                  className="mb-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-800"
                >
                  <p className="font-bold">Unable to sign in</p>
                  <p className="mt-0.5">Email or password is incorrect. Please try again.</p>
                </div>
              )}

              <form action={loginAction} className="space-y-5">
                <label className="block text-[13px] font-bold text-[#123653]">
                  Email address
                  <input
                    className="mt-2 h-[51px] w-full rounded-[10px] border border-[#c8dfef] bg-[#fbfdff] px-4 text-[14px] font-normal text-[#092f55] outline-none transition placeholder:text-[#8ba2b6] hover:border-[#87bfe2] focus:border-[#0876bd] focus:bg-white focus:ring-4 focus:ring-[#42a9e6]/15"
                    name="email"
                    type="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="name@company.com"
                    required
                    maxLength={254}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </label>

                <label className="block text-[13px] font-bold text-[#123653]">
                  Password
                  <input
                    className="mt-2 h-[51px] w-full rounded-[10px] border border-[#c8dfef] bg-[#fbfdff] px-4 text-[14px] font-normal text-[#092f55] outline-none transition placeholder:text-[#8ba2b6] hover:border-[#87bfe2] focus:border-[#0876bd] focus:bg-white focus:ring-4 focus:ring-[#42a9e6]/15"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </label>

                <button
                  type="submit"
                  className="group flex h-[52px] w-full items-center justify-between rounded-[10px] bg-[#07518a] px-5 text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(7,81,138,0.14)] transition hover:-translate-y-px hover:bg-[#0876bd] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#42a9e6]"
                >
                  Sign in to admin
                  <ArrowRight
                    aria-hidden="true"
                    size={17}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              <div className="mt-7 flex items-start gap-3 border-t border-[#e0edf6] pt-5">
                <LockKeyhole
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-[#0b5a8e]"
                />
                <p className="text-[12px] leading-5 text-[#60798d]">
                  <span className="font-bold text-[#123653]">Secure administrator access.</span>{" "}
                  This area is limited to authorized website administrators.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-[#d8eaf5] py-4 text-[11px] text-[#60798d]">
          {/* <span>© {new Date().getFullYear()} The House of Labels</span> */}
          <span>© The House of Labels</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.8} />
            Authorized access only
          </span>
        </footer>
      </div>
    </main>
  );
}
