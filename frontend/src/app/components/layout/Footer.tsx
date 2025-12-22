export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-midnight-950 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-aurora-purple to-aurora-cyan flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-semibold text-gray-300 text-sm">RAG PDF Chat</span>
        </div>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} All rights reserved. Built with AI.
        </p>
      </div>
    </footer>
  );
}