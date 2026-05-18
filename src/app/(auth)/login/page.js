"use client";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear old session/activity data to prevent immediate auto-logout bug
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/today" });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8f9fa] flex items-center justify-center font-sans p-4 sm:p-8 overflow-hidden">

      {/* Main Container - Perfect fit, no scroll */}
      <div className="w-full max-w-[900px] h-full max-h-[600px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

        {/* Left Side (White) */}
        <div className="flex-1 flex flex-col pt-12 px-10 md:px-14 relative bg-white z-10">
          <div className="mb-6">
            <h1 className="text-[11px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-3">
              DayFlow
            </h1>
            <h2 className="text-[2.5rem] font-serif font-medium text-gray-900 tracking-tight leading-tight">
              Welcome back.
            </h2>
          </div>
          <p className="text-gray-500 text-[15px] font-light leading-relaxed max-w-[380px]">
            Sign in to access your personalized daily tracker, follow routines you love, and build habits that matter to you.
          </p>

          <div className="flex-1 flex justify-center items-end pb-8 mt-4">
            <Image
              src="/login-illustration.png"
              alt="Daily Routine Tracker"
              width={380}
              height={380}
              className="w-full max-w-[280px] object-contain object-bottom mix-blend-multiply pointer-events-none"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Right Side (Soft Mint/Gray) */}
        <div className="w-full md:w-[42%] bg-[#f4f7f6] flex flex-col items-center py-12 px-8 relative border-l border-gray-100">


          <div className="w-full max-w-[260px] flex flex-col items-center justify-center flex-1">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={`w-full bg-white text-gray-800 border border-gray-200 rounded-full h-[52px] px-5 flex items-center transition-all duration-300 group shadow-sm ${
                isLoading 
                  ? "opacity-80 cursor-not-allowed" 
                  : "hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center w-full gap-3">
                  <svg className="animate-spin h-5 w-5 text-[#2b7a6b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-500 font-medium text-[14.5px] tracking-wide">Connecting...</span>
                </div>
              ) : (
                <>
                  <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                  </svg>
                  <span className="flex-1 text-center font-medium text-[14.5px] pr-5 tracking-wide text-gray-700">Continue with Google</span>
                </>
              )}
            </button>
            <div className="mt-6 text-[13px] text-gray-500 text-center w-full font-light tracking-wide">
              Are you new to DayFlow? <button onClick={handleSignIn} disabled={isLoading} className="text-[#2b7a6b] hover:text-[#1d5c50] font-medium transition-colors ml-1 disabled:opacity-50">Sign up.</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
