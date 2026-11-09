import React, { useState, useMemo } from "react";
import {
  Palette,
  Layout,
  Type,
  Laptop,
  Smartphone,
  Save,
  Eye,
  RefreshCw,
  Link as LinkIcon,
  Shield,
  Send,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateProject, sendTestEmail } from "@/api/ProjectAPI";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import TechSeparator from "@/components/common/TechSeparator";

const EmailTemplateEditor = ({ project, onUpdated }) => {
  const { user } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState(project.emailTemplate?.logoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(
    project.emailTemplate?.primaryColor || "#000000",
  );
  const [subjectLine, setSubjectLine] = useState(
    project.emailTemplate?.subjectLine ||
      `Verify your identity – ${project.name}`,
  );
  const [footerText, setFooterText] = useState(
    project.emailTemplate?.footerText || "Secure Identity for Developers",
  );
  const [companyAddress, setCompanyAddress] = useState(
    project.emailTemplate?.companyAddress || "",
  );
  const [supportUrl, setSupportUrl] = useState(
    project.emailTemplate?.supportUrl || "",
  );
  const [privacyUrl, setPrivacyUrl] = useState(
    project.emailTemplate?.privacyUrl || "",
  );
  const [securityUrl, setSecurityUrl] = useState(
    project.emailTemplate?.securityUrl || "",
  );
  const [customBody, setCustomBody] = useState(
    project.emailTemplate?.customBody ||
      `We received a request to access your <strong>${project.name}</strong> account. To continue, please confirm your identity using the verification code below.`,
  );
  const [showMetadata, setShowMetadata] = useState(
    project.emailTemplate?.showMetadata ?? true,
  );

  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [testEmail, setTestEmail] = useState(user?.email || "");

  const hasChanges = useMemo(() => {
    const et = project.emailTemplate || {};
    return (
      logoUrl !== (et.logoUrl || "") ||
      primaryColor !== (et.primaryColor || "#000000") ||
      subjectLine !==
        (et.subjectLine || `Verify your identity – ${project.name}`) ||
      footerText !== (et.footerText || "Secure Identity for Developers") ||
      companyAddress !== (et.companyAddress || "") ||
      supportUrl !== (et.supportUrl || "") ||
      privacyUrl !== (et.privacyUrl || "") ||
      securityUrl !== (et.securityUrl || "") ||
      customBody !==
        (et.customBody ||
          `We received a request to access your <strong>${project.name}</strong> account. To continue, please confirm your identity using the verification code below.`) ||
      showMetadata !== (et.showMetadata ?? true)
    );
  }, [
    logoUrl,
    primaryColor,
    subjectLine,
    footerText,
    companyAddress,
    supportUrl,
    privacyUrl,
    securityUrl,
    customBody,
    showMetadata,
    project,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateProject(project._id, {
        emailTemplate: {
          logoUrl,
          primaryColor,
          subjectLine,
          footerText,
          companyAddress,
          supportUrl,
          privacyUrl,
          securityUrl,
          customBody,
          showMetadata,
        },
      });
      if (res?.success) {
        toast.success("Email template synchronized with delivery gateway");
        onUpdated();
      }
    } catch (err) {
      toast.error("Failed to update template");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return toast.error("Enter a recipient email address");
    if (hasChanges) await handleSave();
    try {
      setSendingTest(true);
      const res = await sendTestEmail(project._id, testEmail);
      if (res?.success)
        toast.success(`Sample test transmission dispatched to ${testEmail}`);
    } catch (err) {
      toast.error(err.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const resetToDefault = () => {
    setLogoUrl("");
    setPrimaryColor("#000000");
    setSubjectLine(`Verify your identity – ${project.name}`);
    setFooterText("Secure Identity for Developers");
    setCompanyAddress("");
    setSupportUrl("");
    setPrivacyUrl("");
    setSecurityUrl("");
    setCustomBody(
      `We received a request to access your <strong>${project.name}</strong> account. To continue, please confirm your identity using the verification code below.`,
    );
    setShowMetadata(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Email Customization
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            Calibrate branded verification emails, OTP challenge templates, and
            legal links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="h-8 font-mono text-xs border-border gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            <span>RESET DEFAULTS</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="h-8 px-4 font-mono text-xs disabled:opacity-50 cursor-pointer shadow-xs gap-1.5"
          >
            {saving ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            <span>{saving ? "SAVING..." : "SAVE TEMPLATE"}</span>
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Editor (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form Columns (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Branding & Visuals */}
          <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground uppercase flex items-center gap-2">
                <Layout className="h-3.5 w-3.5 text-muted-foreground" />
                <span>01 // BRANDING ASSETS</span>
              </span>
              <span className="text-muted-foreground text-[10px]">
                VISUAL_IDENTITY
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="logo"
                  className="text-xs font-mono text-muted-foreground"
                >
                  LOGO ASSET URL
                </Label>
                <Input
                  id="logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://app.domain.com/brand-logo.png"
                  className="h-9 text-xs font-mono bg-background border-input text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="color"
                  className="text-xs font-mono text-muted-foreground"
                >
                  ACCENT COLOR (HEX)
                </Label>
                <div className="flex gap-2">
                  <div
                    className="h-9 w-9 rounded border border-border shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    id="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#000000"
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Subject & Body Content */}
          <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground uppercase flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                <span>02 // COPY &amp; CONTENT</span>
              </span>
              <span className="text-muted-foreground text-[10px]">
                PAYLOAD_TEXT
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="subject"
                  className="text-xs font-mono text-muted-foreground"
                >
                  SUBJECT LINE
                </Label>
                <Input
                  id="subject"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="h-9 text-xs font-mono bg-background border-input text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="body"
                  className="text-xs font-mono text-muted-foreground"
                >
                  BODY COPY (HTML SUPPORTED)
                </Label>
                <Textarea
                  id="body"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="min-h-24 text-xs font-mono bg-background border-input text-foreground leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Footer & Compliance URLs */}
          <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground uppercase flex items-center gap-2">
                <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>03 // LEGAL LINKS &amp; FOOTER</span>
              </span>
              <span className="text-muted-foreground text-[10px]">
                COMPLIANCE
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono text-muted-foreground">
                  COMPANY PHYSICAL ADDRESS
                </Label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="100 Mission St, San Francisco, CA"
                  className="h-9 text-xs font-mono bg-background border-input text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">
                    SUPPORT URL
                  </Label>
                  <Input
                    value={supportUrl}
                    onChange={(e) => setSupportUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">
                    PRIVACY URL
                  </Label>
                  <Input
                    value={privacyUrl}
                    onChange={(e) => setPrivacyUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">
                    SECURITY URL
                  </Label>
                  <Input
                    value={securityUrl}
                    onChange={(e) => setSecurityUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">
                    FOOTER SIGNATURE
                  </Label>
                  <Input
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                    <span>INCLUDE CLIENT TELEMETRY</span>
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Renders IP address, browser, and UTC timestamp in email
                    footer.
                  </p>
                </div>
                <Switch
                  checked={showMetadata}
                  onCheckedChange={setShowMetadata}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Send Test Email */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-foreground flex items-center gap-2">
                <Send className="h-3.5 w-3.5 text-muted-foreground" />
                <span>DISPATCH SAMPLE TRANSMISSION</span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                TEST PING
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="h-9 text-xs font-mono bg-background border-input text-foreground"
              />
              <Button
                size="sm"
                onClick={handleSendTest}
                disabled={sendingTest || !testEmail}
                className="h-9 px-4 font-mono text-xs shrink-0 cursor-pointer shadow-xs gap-1.5"
              >
                {sendingTest ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                <span>SEND</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Live Preview Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground uppercase">
                RENDERED RECIPIENT PREVIEW
              </span>
            </div>
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded border border-border">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Laptop className="h-3 w-3" />
                <span>DESKTOP</span>
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>MOBILE</span>
              </button>
            </div>
          </div>

          {/* Email Preview Frame */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 flex justify-center shadow-xs">
            <div
              className={`bg-white text-neutral-900 shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-neutral-200 ${
                previewDevice === "mobile" ? "w-90" : "w-full max-w-xl"
              }`}
            >
              {/* Fake Mail Client Header */}
              <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2 flex items-center gap-2 text-xs font-mono text-neutral-500">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-neutral-300" />
                  <div className="h-2 w-2 rounded-full bg-neutral-300" />
                  <div className="h-2 w-2 rounded-full bg-neutral-300" />
                </div>
                <div className="flex-1 text-center truncate px-2 font-medium text-neutral-700">
                  {subjectLine}
                </div>
              </div>

              {/* Email Content Container */}
              <div className="p-6 sm:p-8 space-y-6 font-sans">
                {/* Logo and Project Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-6 w-auto" />
                    ) : (
                      <div className="h-6 w-6 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {project.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold text-sm text-neutral-900">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    ENCLAVE SECURED
                  </span>
                </div>

                {/* Main Body */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Verify your identity
                  </h2>

                  <div
                    className="text-xs text-neutral-600 leading-relaxed font-normal"
                    dangerouslySetInnerHTML={{ __html: customBody }}
                  />

                  {/* 6-Digit Challenge Box */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 text-center my-4 space-y-1">
                    <div
                      className="text-3xl font-mono font-bold tracking-[0.25em]"
                      style={{ color: primaryColor }}
                    >
                      482 910
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      ONE-TIME CRYPTOGRAPHIC PASSCODE
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      Valid for 10 minutes from dispatch
                    </div>
                  </div>

                  {/* Metadata telemetry */}
                  {showMetadata && (
                    <div className="text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-3 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Timestamp</span>
                        <span>
                          {new Date()
                            .toISOString()
                            .replace("T", " ")
                            .slice(0, 19)}{" "}
                          UTC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Security Gate</span>
                        <span>PKCE S256 / SHA-256</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Ingress IP</span>
                        <span>192.168.1.1 (Verified)</span>
                      </div>
                    </div>
                  )}

                  {/* Security Advisory */}
                  <div className="text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200 p-3 rounded leading-relaxed">
                    <strong>Security Notice:</strong> If you did not initiate
                    this authentication request, please ignore this
                    transmission.
                  </div>
                </div>

                {/* Email Footer */}
                <div className="pt-4 border-t border-neutral-100 text-center text-[11px] font-mono text-neutral-400 space-y-2">
                  <div className="flex justify-center gap-3 text-neutral-600">
                    {supportUrl && <span>Support</span>}
                    {privacyUrl && <span>Privacy</span>}
                    {securityUrl && <span>Security</span>}
                  </div>
                  <div>
                    &copy; {new Date().getFullYear()} {project.name}.{" "}
                    {companyAddress || "Identity Infrastructure"}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {footerText}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 pt-1">
                    POWERED BY AUTHTOKEN ENCLAVE // AUTHTECHNOLOGIES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
