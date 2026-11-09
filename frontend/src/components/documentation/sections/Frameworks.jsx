import React from "react";
import { Layers } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import TechSeparator from "@/components/common/TechSeparator";

const Frameworks = () => {
  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>05</span>
          <TechSeparator />
          <span>FRAMEWORK ADAPTERS</span>
          <TechSeparator />
          <span>REACT &amp; NODE.JS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Framework Integration Patterns
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-2xl">
          Practical patterns for wiring AuthSphere into React SPAs, Next.js
          applications, and backend API middleware.
        </p>
      </div>

      <div className="space-y-8">
        {/* React Hook Pattern */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[01]</span>
            <span>React SPA: State &amp; Protected Route</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Create a custom hook or wrapper component to gate access to
            authenticated routes:
          </p>
          <DocsCodeBlock
            id="react-protected-route"
            code={`import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthSphere from '@authspherejs/sdk';

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if valid token exists in storage
    const authed = AuthSphere.isAuthenticated();
    setAuthenticated(authed);
    setLoading(false);
  }, []);

  if (loading) return <div>Checking session...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
};`}
            language="javascript"
          />
        </section>

        {/* Backend Middleware */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[02]</span>
            <span>Node / Express: JWT Verification Middleware</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            AuthSphere access tokens are standard HMAC-SHA256 (HS256) JWTs. Your
            backend can verify incoming{" "}
            <code>Authorization: Bearer &lt;token&gt;</code> headers using
            standard libraries like <code>jsonwebtoken</code>:
          </p>
          <DocsCodeBlock
            id="node-express-middleware"
            code={`import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.AUTHTOKEN_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = payload; // Contains sub (userId), email, username, and projectId
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}`}
            language="javascript"
          />
        </section>

        {/* Next.js Note */}
        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1 font-mono text-xs">
          <span className="font-bold text-foreground">
            NEXT.JS SERVER COMPONENTS &amp; COOKIES
          </span>
          <p className="text-muted-foreground font-sans leading-relaxed text-xs">
            For Next.js App Router applications, set{" "}
            <code>storageType: 'cookie'</code> in your client configuration so
            access and refresh tokens are sent along with server-rendered
            document requests.
          </p>
        </div>
      </div>
    </article>
  );
};

export default Frameworks;
