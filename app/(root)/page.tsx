import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-300">
            Please log in to continue
          </h2>
        </div>
      </main>
    );
  }

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview && allInterview.length > 0;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-32 left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/60 border border-slate-700/50 text-slate-300 rounded-full text-sm font-medium backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  AI-Powered Interview Practice
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-6xl max-lg:text-5xl max-md:text-4xl font-bold text-white leading-tight tracking-tight">
                    Master Your Next{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                      Interview
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                    Get personalized AI feedback, practice with real interview scenarios, and track your performance with detailed analytics.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button asChild className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-6 text-lg rounded-2xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300">
                    <Link href="/interview" className="flex items-center gap-2">
                      Start Interview
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </Button>
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl border-2 border-slate-700 text-slate-300 hover:bg-slate-900 hover:border-slate-600 hover:text-white transition-all duration-300 font-semibold">
                    View Demo
                  </Button>
                </div>

                {/* Stats/Features */}
                <div className="flex items-center gap-8 pt-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    Real-time feedback
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    1000+ questions
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    Performance analytics
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative lg:justify-self-end">
                <div className="relative">
                  {/* Glow effect behind image */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-2xl opacity-60"></div>
                  
                  {/* Image container */}
                  <div className="relative bg-slate-900/40 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/30">
                    <Image
                      src="/tech.jpg"
                      alt="AI Interview Assistant"
                      width={400}
                      height={400}
                      className="w-full max-w-md mx-auto transition-transform hover:scale-105 duration-700"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Your Interview History</h2>
              <p className="text-slate-400 text-lg">Track your progress and review past performances</p>
            </div>
          </div>

          {/* Interview Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <div
                  key={interview.id}
                  className="group relative"
                >
                  {/* Hover glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Card */}
                  <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 overflow-hidden">
                    <InterviewCard
                      userId={user.id}
                      interviewId={interview.id}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="text-center py-20 bg-slate-900/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-700/50">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">No interviews yet</h3>
                  <p className="text-slate-400 mb-8 text-lg">Start your first interview to see your progress here</p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-4 text-lg rounded-2xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300">
                    <Link href="/interview">Take Your First Interview</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Available Interviews Section */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Available Practice Interviews</h2>
              <p className="text-slate-400 text-lg">Challenge yourself with new interview scenarios</p>
            </div>
          </div>

          {/* Interview Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hasUpcomingInterviews ? (
              allInterview?.map((interview) => (
                <div
                  key={interview.id}
                  className="group relative"
                >
                  {/* Hover glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Card */}
                  <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 overflow-hidden">
                    <InterviewCard
                      userId={user.id}
                      interviewId={interview.id}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="text-center py-20 bg-slate-900/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-700/50">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">No interviews available</h3>
                  <p className="text-slate-400 text-lg">Check back later for new interview opportunities</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button asChild className="group w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border border-slate-700/30">
          <Link href="/interview" className="flex items-center justify-center">
            <svg className="w-6 h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default Home;