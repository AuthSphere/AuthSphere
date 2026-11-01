export const renderProviderNotEnabled = (provider, projectName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <title>Authentication Disabled</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%   { transform: translateY(0px); }
      50%  { transform: translateY(-14px); }
      100% { transform: translateY(0px); }
    }

    .fade-in {
      animation: fadeIn 1s ease forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      to { opacity: 1; }
    }

    .stagger-1 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.10s forwards; opacity:0; }
    .stagger-2 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s forwards; opacity:0; }
    .stagger-3 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.34s forwards; opacity:0; }
    .stagger-4 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.46s forwards; opacity:0; }
    .stagger-5 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.56s forwards; opacity:0; }
    .stagger-6 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.66s forwards; opacity:0; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .btn-back {
      transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
    }
    .btn-back:hover {
      background-color: #1e293b !important;
      box-shadow: 0 8px 28px rgba(15,23,42,0.30) !important;
      transform: translateY(-1px);
    }
    .btn-back:active { transform: scale(0.97); }
  </style>
</head>

<body class="bg-[#F7F8FA] flex items-center justify-center p-5 selection:bg-rose-500 selection:text-white antialiased">

  <!-- Background blobs -->
  <div class="fixed top-[-8%] left-[-6%] w-[480px] h-[480px] rounded-full bg-rose-100/60 blur-[110px] -z-10 pointer-events-none fade-in" style="animation-delay:0s;"></div>
  <div class="fixed bottom-[-8%] right-[-6%] w-[480px] h-[480px] rounded-full bg-sky-100/60 blur-[110px] -z-10 pointer-events-none fade-in" style="animation-delay:0.1s;"></div>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-violet-100/25 blur-[90px] -z-10 pointer-events-none fade-in" style="animation-delay:0.2s;"></div>

  <!-- Card -->
  <div class="w-full max-w-[900px] bg-white/75 backdrop-blur-2xl border border-white/90 rounded-[2.25rem] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.10),0_2px_8px_-2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-8 lg:gap-14 px-8 sm:px-12 md:px-14 py-10 sm:py-12 stagger-1">

    <!-- Illustration -->
    <div class="w-full md:w-[42%] flex-shrink-0 flex justify-center items-center order-1 relative">
      <div class="absolute w-[78%] h-[78%] bg-gradient-to-br from-rose-200/50 via-rose-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <img
        src="/assets/oVZrPhQjcB.gif"
        alt="Authentication Disabled"
        class="w-full max-w-[240px] md:max-w-[300px] animate-float drop-shadow-2xl"
      />
    </div>

    <!-- Content -->
    <div class="w-full md:w-[58%] flex flex-col items-center md:items-start text-center md:text-left order-2">

      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-[11px] font-bold tracking-widest uppercase mb-5 stagger-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Action Required
      </div>

      <!-- Heading -->
      <h1 class="text-[2.55rem] lg:text-[2.9rem] font-extrabold text-slate-900 mb-4 tracking-[-0.03em] leading-[1.06] stagger-3">
        Provider<br/>Not Enabled
      </h1>

      <!-- Description -->
      <p class="text-slate-500 text-[15px] md:text-[15.5px] leading-relaxed mb-7 stagger-4">
        The
        <span class="font-bold text-slate-800 capitalize inline-block px-1.5 py-0.5 bg-slate-100 rounded-md text-[13.5px] align-middle">${provider}</span>
        login provider is currently not enabled for the
        <span class="font-bold text-slate-800">${projectName}</span> project.
      </p>

      <!-- Button -->
      <button
        onclick="history.back()"
        class="btn-back w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 text-white text-[13.5px] font-semibold py-3.5 px-7 rounded-[14px] shadow-[0_4px_16px_rgba(15,23,42,0.22)] stagger-5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>

      <!-- Divider -->
      <hr class="w-full border-slate-100 my-6 stagger-5" />

      <!-- Developer hint -->
      <div class="flex items-start gap-3.5 stagger-6">
        <div class="flex-shrink-0 p-2 bg-slate-50 border border-slate-100/80 rounded-xl text-slate-400 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 class="text-[12.5px] font-bold text-slate-700 mb-0.5">Are you the developer?</h4>
          <p class="text-[12.5px] text-slate-400 leading-relaxed">Enable this provider in your AuthSphere dashboard settings to allow user authentication.</p>
        </div>
      </div>

    </div>
  </div>

</body>
</html>
`;
