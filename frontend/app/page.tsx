import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const steps = [
  { number: "01", title: "Find your court", text: "Compare courts, rates, and availability in one view." },
  { number: "02", title: "Pick a time", text: "Choose a slot that works for your game and your crew." },
  { number: "03", title: "Show up ready", text: "Your reservation is confirmed instantly and easy to manage." },
];

const benefits = [
  { icon: Clock3, title: "Live availability", text: "See open time slots before you commit." },
  { icon: ShieldCheck, title: "Reliable booking", text: "Your selected slot is held as soon as you confirm." },
  { icon: MapPin, title: "Better court days", text: "Keep every reservation and venue detail together." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#071411] text-[#f4fbf7]">
      <Navbar isAuthenticated={false} />
      <main>
        <section className="relative overflow-hidden border-b border-[#b9f227]/10">
          <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-28 lg:pt-24">
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9f227]/20 bg-[#b9f227]/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#b9f227]"><span className="h-1.5 w-1.5 rounded-full bg-[#b9f227]" />Your game, your time</div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">Make time for a better <span className="text-[#b9f227]">rally.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#9bb3a8] sm:text-lg">CourtBook makes badminton reservations simple. Find a court, lock in a time, and get back to the part that matters: playing.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/courts" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b9f227] px-5 py-3.5 text-sm font-bold text-[#071411] transition hover:bg-[#d1ff62]">Find a court <ArrowUpRight className="h-4 w-4" /></Link><Link href="/register" className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-[#b9f227]/50 hover:bg-white/[0.04]">Create an account</Link></div>
            </div>
            <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-[#b9f227]/20 bg-[#10281f] p-6 shadow-2xl shadow-black/20 sm:min-h-[31rem]"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[3rem] border-[#b9f227]/10" /><div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border-[4rem] border-white/[0.04]" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#9bb3a8]"><span>Today&apos;s court view</span><Trophy className="h-5 w-5 text-[#b9f227]" /></div><div><div className="mb-5 text-8xl font-semibold tracking-[-0.08em] text-[#b9f227]">03</div><p className="max-w-xs text-2xl font-medium leading-tight text-white">courts ready for your next session.</p><div className="mt-8 flex items-center gap-2 text-sm text-[#9bb3a8]"><CalendarCheck className="h-4 w-4 text-[#b9f227]" /> Reserve in under a minute</div></div></div></div>
          </div>
        </section>
        <section className="border-b border-[#b9f227]/10 bg-[#0b1c17]"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 md:grid-cols-3 lg:px-12">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b9f227]/10 text-[#b9f227]"><Icon className="h-5 w-5" /></div><div><h2 className="font-semibold text-white">{title}</h2><p className="mt-1 text-sm leading-6 text-[#9bb3a8]">{text}</p></div></div>)}</div></section>
        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9f227]">A simpler rhythm</p><h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">Less admin. More time on court.</h2></div><div className="divide-y divide-white/10 border-y border-white/10">{steps.map((step) => <div key={step.number} className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6"><span className="text-sm font-bold text-[#b9f227]">{step.number}</span><div><h3 className="text-xl font-semibold text-white">{step.title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-[#9bb3a8]">{step.text}</p></div></div>)}</div></div><div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#b9f227]/20 bg-[#10281f] p-7 sm:flex-row sm:items-center sm:p-9"><div><p className="text-xl font-semibold text-white">Ready to play?</p><p className="mt-1 text-sm text-[#9bb3a8]">Browse courts and find your next open slot.</p></div><Link href="/courts" className="inline-flex items-center gap-2 rounded-xl bg-[#b9f227] px-5 py-3 text-sm font-bold text-[#071411] hover:bg-[#d1ff62]">Browse courts <Check className="h-4 w-4" /></Link></div></section>
      </main>
      <Footer />
    </div>
  );
}
