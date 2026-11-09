import React from "react";
import { KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";
import TechSeparator from "@/components/common/TechSeparator";

const LocalAuth = () => {
  return (
    <article className="space-y-8 text-foreground font-sans">
      {/* Eyebrow Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>03</span>
          <TechSeparator />
          <span>AUTHENTICATION FLOWS</span>
          <TechSeparator />
          <span>EMAIL &amp; PASSWORD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Local Credential Authentication
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed max-w-2xl">
          Standard email and password registration, salted Bcrypt password
          hashing with HaveIBeenPwned breach validation, and 6-digit OTP
          verification.
        </p>
      </div>

      <div className="space-y-8">
        {/* Registration */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[01]</span>
            <span>Registering a New User</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Call <code>register()</code> with the user's credentials. If your
            project has strict email verification enabled, the account is
            created in a <code>PENDING</code> state and a 6-digit verification
            code is emailed immediately.
          </p>
          <DocsCodeBlock
            id="local-register"
            code={`import AuthSphere from '@authspherejs/sdk';

try {
  const result = await AuthSphere.register({
    email: 'developer@example.com',
    password: 'CorrectHorseBatteryStaple123!',
    username: 'alice_dev',
  });

  // Prompt the user to enter the 6-digit code sent to their email
  console.log('Registration initiated. User ID:', result.user.id);
} catch (error) {
  console.error('Registration failed:', error.message);
}`}
            language="javascript"
          />
        </section>

        {/* Verifying the OTP Code */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[02]</span>
            <span>Verifying the 6-Digit Email Code</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Confirm the challenge code using <code>verifyOTP()</code>. Once
            confirmed, the user account transitions to <code>ACTIVE</code> and
            initial JWT tokens are issued:
          </p>
          <DocsCodeBlock
            id="local-verify-otp"
            code={`try {
  const { user, tokens } = await AuthSphere.verifyOTP({
    email: 'developer@example.com',
    otp: '482910',
  });

  console.log('User verified successfully:', user.email);
  console.log('Access Token:', tokens.accessToken);
} catch (error) {
  // Handle invalid or expired code
  console.error('Invalid OTP:', error.message);
}`}
            language="javascript"
          />
        </section>

        {/* Logging in */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span>[03]</span>
            <span>Authenticating Existing Users</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Pass the email and password to <code>loginLocal()</code>. If the
            user hasn't verified their email yet, the SDK throws an error with{" "}
            <code>sdk_request</code> so you can redirect them to your
            verification screen:
          </p>
          <DocsCodeBlock
            id="local-login"
            code={`try {
  const { user, tokens } = await AuthSphere.loginLocal({
    email: 'developer@example.com',
    password: 'CorrectHorseBatteryStaple123!',
  });

  window.location.href = '/dashboard';
} catch (error) {
  if (error.code === 'EMAIL_NOT_VERIFIED') {
    // Route user to your OTP verification page
    window.location.href = \`/verify?email=\${encodeURIComponent(email)}&sdk_request=\${error.sdk_request}\`;
    return;
  }
  alert('Login failed: ' + error.message);
}`}
            language="javascript"
          />
        </section>
      </div>
    </article>
  );
};

export default LocalAuth;
