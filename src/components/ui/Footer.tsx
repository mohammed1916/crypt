import React from "react";

export default function Footer() {
  return (
    <footer className="acrylic-card-noborderradius w-full flex flex-col md:flex-row items-center justify-between gap-2 p-4 border-t border-border bg-background text-sm mt-8">
      <span className="flex items-center gap-1">
        &copy; 2025 Mohammed Abdullah
      </span>
      <a
        href="https://www.linkedin.com/in/curious-mohammed-abdullah/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
        LinkedIn
      </a>
  <span>Powered by <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="underline">CoinGecko API</a></span>
    </footer>
  );
}
