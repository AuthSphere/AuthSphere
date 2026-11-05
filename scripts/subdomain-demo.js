import http from "http";

const PORT = 3000;

const server = http.createServer((req, res) => {
  const host = req.headers.host || "";
  const cookies = req.headers.cookie || "";
  const isAuthenticated = cookies.includes("auth_session=");

  const isAppDomain = host.startsWith("app.");

  // Parse URL
  const url = new URL(req.url, `http://${host}`);

  // 1. Handle Login action
  if (url.pathname === "/login-action") {
    // Set cookie for all subdomains (.xyz.local or .localhost)
    // Determine cookie domain: strip port and get root domain
    const rootDomain = host.split(":")[0].replace(/^app\./, "");

    // Cookie attribute: Domain=.rootDomain allows app.rootDomain to read it
    res.writeHead(302, {
      "Set-Cookie": `auth_session=user_demo_123; Domain=.${rootDomain}; Path=/; HttpOnly; SameSite=Lax`,
      Location: `http://app.${rootDomain}:${PORT}/dashboard`,
    });
    return res.end();
  }

  // 2. Handle Logout action
  if (url.pathname === "/logout") {
    const rootDomain = host.split(":")[0].replace(/^app\./, "");
    res.writeHead(302, {
      "Set-Cookie": `auth_session=; Domain=.${rootDomain}; Path=/; Max-Age=0; HttpOnly`,
      Location: `http://${rootDomain}:${PORT}/`,
    });
    return res.end();
  }

  // 3. Routing: App Subdomain (app.xyz.local)
  if (isAppDomain) {
    if (!isAuthenticated) {
      const rootDomain = host.split(":")[0].replace(/^app\./, "");
      res.writeHead(401, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>App - Protected</title></head>
        <body style="font-family:sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="background:#1e293b;padding:2.5rem;border-radius:12px;text-align:center;max-width:420px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div style="font-size:3rem;margin-bottom:1rem;">🔒</div>
            <h2 style="color:#ef4444;margin:0 0 10px 0;">Access Denied</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.5;">You are visiting <strong>${host}</strong> without an active session cookie.</p>
            <a href="http://${rootDomain}:${PORT}" style="display:inline-block;margin-top:1.5rem;background:#3b82f6;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Go to Landing Page</a>
          </div>
        </body>
        </html>
      `);
    }

    // Authenticated Dashboard
    const rootDomain = host.split(":")[0].replace(/^app\./, "");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Dashboard - app.${rootDomain}</title></head>
      <body style="font-family:sans-serif;background:#090d16;color:#f8fafc;margin:0;padding:2rem;">
        <div style="max-width:800px;margin:0 auto;background:#131c2e;border:1px solid #1e293b;border-radius:12px;padding:2rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:1rem;margin-bottom:1.5rem;">
            <div>
              <span style="background:#10b981;color:#042f2e;font-size:12px;font-weight:bold;padding:4px 8px;border-radius:4px;">AUTHENTICATED</span>
              <h1 style="margin:8px 0 0 0;font-size:24px;">Welcome to the App Dashboard!</h1>
            </div>
            <a href="/logout" style="background:#ef4444;color:white;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Sign Out</a>
          </div>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;">
            You are currently on <code style="background:#1e293b;padding:2px 6px;border-radius:4px;color:#38bdf8;">http://${host}</code>.
          </p>
          <div style="background:#0f172a;padding:1.2rem;border-radius:8px;border-left:4px solid #10b981;margin-top:1.5rem;">
            <p style="margin:0;font-family:monospace;font-size:13px;color:#a7f3d0;">
              ✓ Shared Cookie Detected: <b>auth_session=user_demo_123</b><br>
              ✓ Cookie Domain: <b>.${rootDomain}</b>
            </p>
          </div>
          <div style="margin-top:2rem;">
            <a href="http://${rootDomain}:${PORT}" style="color:#38bdf8;text-decoration:none;">← Back to Landing Page</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // 4. Routing: Landing Page (xyz.local)
  const rootDomain = host.split(":")[0];
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  return res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>xyz.local - Landing Page</title></head>
    <body style="font-family:sans-serif;background:#090d16;color:#f8fafc;margin:0;display:flex;flex-direction:column;min-height:100vh;">
      <header style="border-bottom:1px solid #1e293b;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:18px;letter-spacing:1px;color:#38bdf8;">XYZ.COM</strong>
        <nav>
          ${
            isAuthenticated
              ? `<a href="http://app.${rootDomain}:${PORT}/dashboard" style="background:#10b981;color:white;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Open App (Already Logged In)</a>`
              : `<a href="/login-action" style="background:#3b82f6;color:white;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Log In & Go to App →</a>`
          }
        </nav>
      </header>
      <main style="flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;">
        <div style="max-width:600px;text-align:center;">
          <h1 style="font-size:42px;margin-bottom:1rem;line-height:1.2;">Public Landing Page</h1>
          <p style="font-size:18px;color:#94a3b8;line-height:1.6;margin-bottom:2rem;">
            Current Domain: <code style="background:#1e293b;padding:3px 8px;border-radius:4px;color:#38bdf8;">http://${host}</code><br>
            Status: ${isAuthenticated ? '<span style="color:#10b981;font-weight:bold;">Logged In</span>' : '<span style="color:#ef4444;font-weight:bold;">Not Logged In</span>'}
          </p>
          ${
            !isAuthenticated
              ? `
            <a href="/login-action" style="display:inline-block;background:#3b82f6;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;box-shadow:0 4px 14px rgba(59,130,246,0.4);">
              Simulate Login & Redirect to app.${rootDomain}
            </a>
          `
              : `
            <a href="http://app.${rootDomain}:${PORT}/dashboard" style="display:inline-block;background:#10b981;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;">
              Go to Dashboard (app.${rootDomain}) →
            </a>
            <div style="margin-top:1rem;">
              <a href="/logout" style="color:#ef4444;font-size:14px;">Sign Out</a>
            </div>
          `
          }
        </div>
      </main>
    </body>
    </html>
  `);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Subdomain demo server running on http://0.0.0.0:${PORT}`);
});
