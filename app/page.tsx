"use client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="relative flex-grow bg-gradient-to-b from-[#b78784] via-[#8e6e68] to-[#000] text-white overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex items-center justify-center h-full md:px-20">
          <div className="md:p-0 p-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
            {/* Left Section - Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight ">
                Capture. <br />
                <span className="text-amber-400">Frame</span>. Cherish.
              </h1>
              <p className="text-lg text-gray-300 max-w-md">
                Transform your memories into timeless art. Upload, customize,
                and frame your moments.
              </p>
              <div>
                <Link
                  href={"/create"}
                  className="mt-4 px-6 py-3 rounded-2xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-all duration-300"
                >
                  Create Polaroids
                </Link>
              </div>
            </div>

            {/* Right Section - Hero Image */}
            <div className="relative w-full h-[350px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/hero.jpg"
                alt="Framed Memory"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
