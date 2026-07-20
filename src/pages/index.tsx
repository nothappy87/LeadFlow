import Head from "next/head";
import Link from "next/link";

const features = [
  {
    svg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-400">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Pick Your Industry",
    desc: "Choose from 10 business categories to find exactly the leads you need. Real estate, B2B, insurance, trades, and more.",
  },
  {
    svg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Get Qualified Leads",
    desc: "Every lead comes with a quality score so you can prioritise the best opportunities. Hot, warm, or cold - you decide.",
  },
  {
    svg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-400">
        <path
          d="M12 2L3 7v6c0 5.25 3.58 10.14 9 11 5.42-.86 9-5.75 9-11V7l-9-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Close More Deals",
    desc: "Save promising leads and dismiss the rest. Focus on what matters and watch your pipeline grow.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["10 leads/month", "5 categories", "Basic scoring"],
    cta: "Get Started Free",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["100 leads/month", "All categories", "CRM export", "Email alerts"],
    cta: "Start Pro",
    href: "https://buy.stripe.com/bJeeVd07A5nl6Kf7f6dAk00",
    highlight: true,
  },
  {
    name: "Business",
    price: "$79",
    period: "/mo",
    features: ["500 leads/month", "Priority scoring", "Advanced filters", "API access", "Priority support"],
    cta: "Start Business",
    href: "https://buy.stripe.com/3cIaEXaMe8zxgkP42UdAk01",
    highlight: false,
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>SendWell - Never run out of leads again</title>
        <meta
          name="description"
          content="SendWell finds quality prospects tailored to your business."
        />
      </Head>

      <main className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
          <div className="animate-slide-up max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-600/10 border border-teal-600/30 text-teal-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              Automated lead generation for your business
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Never run out of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
                leads
              </span>{" "}
              again
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
              SendWell finds quality prospects tailored to your business. Pick your
              industry and start closing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
              >
                Get Started - It&apos;s Free
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
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-600/50 hover:bg-gray-900/80 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4">{f.svg}</div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-20 bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-md mx-auto">
              Start free and upgrade as your pipeline grows.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-gray-950 border rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                    tier.highlight
                      ? "border-teal-500/60 ring-1 ring-teal-500/30 shadow-lg shadow-teal-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-teal-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                      <span className="text-gray-400 text-sm">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-teal-400 shrink-0"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={tier.href}
                    className={`block text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      tier.highlight
                        ? "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SendWell. Built for closers.
        </footer>
      </main>
    </>
  );
}
