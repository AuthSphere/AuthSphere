import React from "react";
import TechSeparator from "@/components/common/TechSeparator";

export const OpenSourceSection = () => {
  return (
    <section
      id="community"
      className="w-full bg-[#09090c] text-white py-24 border-b border-neutral-800 isolate"
    >
      <div className="max-w-340 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Pitch */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded bg-[#18191D] border border-[#26262b] text-[11px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>04</span>
              <TechSeparator />
              <span>PUBLIC REPOSITORY &amp; ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Built in the open.
              <br />
              Improved together.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
              AuthSphere is an open-source project. Developers are welcome to
              explore the codebase, contribute improvements, report issues, and
              help shape the future of the project.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-md bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
                href="https://github.com/AuthSphere"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Explore on GitHub</span>
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-md bg-transparent text-white border border-[#26262b] hover:border-white font-mono text-xs font-medium transition-all cursor-pointer"
                href="/docs"
              >
                <span>Read Documentation</span>
              </a>
            </div>
          </div>

          {/* Right: GitHub Showcase Card */}
          <div className="lg:col-span-5 bg-[#121316] border border-[#26262b] p-6 rounded-lg flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#26262b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#18191D] border border-[#26262b] flex items-center justify-center text-white">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <a
                    className="text-sm font-mono font-bold text-white hover:underline"
                    href="https://github.com/AuthSphere"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    AuthSphere
                  </a>
                  <div className="text-[11px] font-mono text-neutral-400">
                    GitHub Repository · Public
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-center font-mono text-xs">
              <div className="p-3 bg-[#18191D] border border-[#26262b] rounded">
                <div className="text-[10px] text-neutral-400">LICENSE</div>
                <div className="text-white font-bold mt-0.5">MIT</div>
              </div>
              <div className="p-3 bg-[#18191D] border border-[#26262b] rounded">
                <div className="text-[10px] text-neutral-400">LANGUAGE</div>
                <div className="text-white font-bold mt-0.5">
                  TypeScript &amp; JS
                </div>
              </div>
              <div className="p-3 bg-[#18191D] border border-[#26262b] rounded">
                <div className="text-[10px] text-neutral-400">
                  CONTRIBUTIONS
                </div>
                <div className="text-white font-bold mt-0.5">PRs Welcome</div>
              </div>
              <div className="p-3 bg-[#18191D] border border-[#26262b] rounded">
                <div className="text-[10px] text-neutral-400">DISCUSSIONS</div>
                <div className="text-white font-bold mt-0.5">RFC Roadmap</div>
              </div>
            </div>

            {/* Architecture Verification Strip */}
            <div className="p-3.5 bg-[#18191D] border border-[#26262b] rounded flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>IDENTITY SPECIFICATION</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SPEC COMPLIANT
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                Full adherence to RFC-7636 (PKCE), RFC-7519 (JWT), and OAuth 2.0
                Authorization Code Grant standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
