import React from "react";
import { Layers } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const Frameworks = ({ publicKey }) => {
  return (
    <article className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">
          Modern Framework Integration
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          While the core SDK is vanilla-JS compatible, we provide high-level
          primitives for modern component-based frameworks to simplify state
          propagation and hydration.
        </p>
      </div>

      <div className="space-y-8">
        {/* React Context */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            React Context Architecture
          </h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            The <code>AuthProvider</code> component implements a top-level
            context provider that manages the reactive state of the currently
            authenticated user. It handles automatic local storage hydration
            during the initial mount and provides a centralized bus for
            session-related events (login, logout, token refresh).
          </p>
          <DocsCodeBlock
            id="react-provider"
            code={`// App.jsx\nimport AuthSphere from '@authspherejs/sdk';\n\nAuthSphere.initAuth({\n  publicKey: '${publicKey}',\n  projectId: 'YOUR_PROJECT_ID',\n  redirectUri: window.location.origin + '/callback'\n});\n\nfunction App() {\n  return <MyRoutes />;\n}`}
            language="javascript"
          />
        </section>

        {/* Auth Hooks */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Reactive Session Hooks
          </h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            The <code>useAuth</code> hook provides typesafe access to the
            authentication state. It exposes boolean flags like{" "}
            <code>isLoading</code> and <code>isAuthenticated</code>, allowing
            for deterministic UI rendering during the token validation phase.
          </p>
          <DocsCodeBlock
            id="react-hooks"
            code={`import AuthSphere from '@authspherejs/sdk';\n\nconst UserProfile = () => {\n  const user = AuthSphere.getUser();\n  const authenticated = AuthSphere.isAuthenticated();\n\n  if (!authenticated) return <LoginButton />;\n\n  return ( \n    <div>\n       Welcome, {user.username}\n       <button onClick={() => AuthSphere.logout()}>Logout</button>\n    </div>\n  );\n}`}
            language="javascript"
          />
        </section>

        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex gap-3 items-start">
          <Layers size={16} className="text-indigo-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-100">
              Server-Side Support
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Our SDKs are designed for universal execution. Use the same
              primitives in Next.js (Client Components) or standard SPA
              environments. SSR Support for middleware-based session guarding is
              available via our <code>@authspherejs/sdk</code> cookie-aware
              utilities.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Frameworks;
