import Link from "next/link";

const page = () => {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-1">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#101010] px-6 py-10 text-center shadow-2xl sm:px-12">

        {/* Background decoration */}
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />

        <div className="relative z-10">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
            Something exciting is coming
          </div>

          {/* Icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl shadow-lg">
            🚀
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Create Events,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Coming Soon.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-full text-base leading-7 text-gray-400 sm:text-lg">
            We're building a better way to bring your events to life.
            Soon, you'll be able to create, manage, and share your
            developer events with the world.
          </p>


          {/* Button */}
          <Link
            href="/"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-gray-200"
          >
            Explore Events
            <span className="ml-2">→</span>
          </Link>

          <p className="mt-8 text-xs text-gray-600">
            More possibilities. Better events. Coming soon.
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
