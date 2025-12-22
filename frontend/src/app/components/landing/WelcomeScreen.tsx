'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/app/components/ui';

export default function WelcomeScreen() {
  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 py-12 lg:py-20 overflow-hidden bg-white">
      {/* Brutalist Marquee Background */}
      <div className="absolute top-20 left-0 w-[120%] -rotate-2 bg-black text-white whitespace-nowrap py-2 z-0 opacity-10 font-syne text-9xl uppercase font-bold select-none animate-marquee pointer-events-none">
        Upload PDF • Analyze • Chat • Insight • Upload PDF • Analyze • Chat • Insight •
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center relative z-10">
        
        <div className="mb-12 relative flex justify-center group cursor-pointer">
          <div className="w-32 h-32 mx-auto bg-black text-white border-[4px] border-black brutalist-shadow rounded-none flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={3}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tighter leading-[0.85] text-center uppercase font-syne text-black">
          CHAT WITH<br/>
          <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '3px black' }}>THE VOID</span>
        </h1>

        <p className="text-xl md:text-2xl text-black font-bold font-space mb-12 max-w-2xl mx-auto leading-tight text-center uppercase border-l-4 border-black pl-6 py-2">
          Unlock the secrets of your documents. <br/>
          <span className="bg-black text-white px-2">Stark. Simple. Fast.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24 w-full max-w-md mx-auto items-center">
          <SignUpButton>
            <Button variant="primary" size="lg" className="w-full h-16 text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              INITIATE_
            </Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="secondary" size="lg" className="w-full h-16 text-xl">
              LOGIN_
            </Button>
          </SignInButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t-[3px] border-black pt-12">
          {[
            {
              title: "Drop Zone",
              desc: "Drag files into the abyss.",
              icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            },
            {
              title: "Neural Link",
              desc: "AI that devours context.",
              icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            },
            {
              title: "Truth Source",
              desc: "Answers extracted from reality.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 border-[3px] border-black hover:bg-black hover:text-white transition-all duration-300 group text-center flex flex-col items-center">
              <div className="w-16 h-16 border-[3px] border-black group-hover:border-white mb-6 flex items-center justify-center bg-gray-100 group-hover:bg-black transition-colors">
                <svg
                  className="w-8 h-8 text-black group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d={item.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 font-syne uppercase">{item.title}</h3>
              <p className="text-base font-space font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}