import Head from "next/head";
import Link from "next/link";

const features = [
  {
    emoji: "🎯",
    title: "Pick Your Industry",
    desc: "Choose from 10 business categories to find exactly the leads you need. Real estate, B2B, insurance, trades, and more.",
  },
  {
    emoji: "⭐",
    title: "Get Qualified Leads",
    desc: "Every lead comes with a quality score so you can prioritise the best opportunities. Hot, warm, or cold — you decide.",
  },
  {
    emoji: "🚀",
    title: "Close More Deals",
    desc: "Save promising leads and dismiss the rest. Focus on what matters and watch your pipeline grow.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>LeadFlow — Never run out of leads again</title>
        <meta
          name="description"
          content="LeadFlow finds quality prospects tailored to your business."
        />
      </Head>

      <main className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
          <div className="animate-slide-up max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Automated lead generation for your business
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Never run out of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                leads
              </span>{" "}
              again
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
              LeadFlow finds quality prospects tailored to your business. Pick your
              industry and start closing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                Get Started — It&apos;s Free
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-base font-medium text-gray-300 transition-all duration-200 active:scale-[0.98]"
              >
                View Demo Leads
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 bg-gray-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12 animate-fade-in">
              Everything you need to fuel your pipeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-600/50 hover:bg-gray-900/80 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-4xl mb-4">{f.emoji}</div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} LeadFlow. Built for closers.
        </footer>
      </main>
    </>
  );
}
