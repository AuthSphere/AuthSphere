import { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateProject, sendTestEmail } from "@/api/ProjectAPI";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const EmailTemplateEditor = ({ project, onUpdated }) => {
  const { user } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState(project.emailTemplate?.logoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(
    project.emailTemplate?.primaryColor || "#4f46e5",
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
      primaryColor !== (et.primaryColor || "#4f46e5") ||
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
        toast.success("Email template updated");
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
    if (!testEmail) return toast.error("Enter an email address");
    if (hasChanges) await handleSave();
    try {
      setSendingTest(true);
      const res = await sendTestEmail(project._id, testEmail);
      if (res?.success) toast.success(`Test email sent to ${testEmail}`);
    } catch (err) {
      toast.error(err.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const resetToDefault = () => {
    setLogoUrl("");
    setPrimaryColor("#4f46e5");
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
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Email Template</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize the verification email sent to your users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-1.5"
          >
            {saving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-4 overflow-y-auto pr-1">
          {/* Branding */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" /> Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="logo" className="text-xs">
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://myapp.com/logo.png"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color" className="text-xs">
                  Primary Color
                </Label>
                <div className="flex gap-2">
                  <div
                    className="h-9 w-9 rounded-md border shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    id="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#4f46e5"
                    className="h-9 text-sm font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" /> Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs">
                  Subject Line
                </Label>
                <Input
                  id="subject"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body" className="text-xs">
                  Welcome Message
                  <span className="ml-1 text-muted-foreground font-normal">
                    (HTML supported)
                  </span>
                </Label>
                <Textarea
                  id="body"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="min-h-[90px] text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer & Links */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" /> Footer & Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Company Address</Label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="123 Innovation Dr, CA"
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Support URL</Label>
                  <Input
                    value={supportUrl}
                    onChange={(e) => setSupportUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Privacy URL</Label>
                  <Input
                    value={privacyUrl}
                    onChange={(e) => setPrivacyUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Security URL</Label>
                  <Input
                    value={securityUrl}
                    onChange={(e) => setSecurityUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Footer Text</Label>
                  <Input
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-card/30 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="metadata"
                    className="text-xs font-medium flex items-center gap-2"
                  >
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                    Include Security Metadata
                  </Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Show device, IP, and timestamp in emails.
                  </p>
                </div>
                <Switch
                  id="metadata"
                  checked={showMetadata}
                  onCheckedChange={setShowMetadata}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Email */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" /> Send Test
              </CardTitle>
              <CardDescription className="text-xs">
                Send a preview to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendTest}
                  disabled={sendingTest || !testEmail}
                  className="gap-1.5 shrink-0"
                >
                  {sendingTest ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Laptop className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex justify-center bg-muted/30 rounded-lg border border-border/50 p-4 overflow-y-auto">
            <div
              className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 ${previewDevice === "mobile" ? "w-[320px]" : "w-full max-w-[full]"}`}
            >
              {/* Browser bar */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 h-8 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-400/60" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
                  <div className="h-2 w-2 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] text-gray-400 rounded px-2 py-0.5 truncate inline-block max-w-[200px]">
                    {subjectLine}
                  </span>
                </div>
              </div>

              {/* Email content */}
              <div className="max-w-full mx-auto bg-white rounded-xl border border-gray-200 shadow-sm font-sans text-[#1e293b] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo" className="h-6 w-auto" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Secure Auth
                  </span>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                  <h1 className="text-lg font-semibold text-gray-900 mb-3">
                    Verify your identity
                  </h1>

                  <div
                    className="text-sm text-gray-600 leading-relaxed mb-5"
                    dangerouslySetInnerHTML={{ __html: customBody }}
                  />

                  {/* OTP */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg text-center py-5 mb-5">
                    <div
                      className="text-2xl font-mono font-semibold tracking-widest"
                      style={{ color: primaryColor }}
                    >
                      892 043
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                      Verification Code
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Valid for 10 minutes
                    </p>
                  </div>

                  {/* Metadata */}
                  {showMetadata && (
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-4 space-y-1">
                      {[
                        [
                          "Time",
                          `${new Date().toUTCString().split(" ").slice(4, 5).join(" ")} UTC`,
                        ],
                        ["Device", "Chrome / Windows"],
                        ["IP Address", "192.168.1.1"],
                        ["Location", "San Francisco, US"],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-gray-400">{label}</span>
                          <span className="font-mono text-gray-700">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                    <strong>Security Notice:</strong> If you didn’t request
                    this, please secure your account.
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 text-center">
                  <div className="text-xs text-gray-500 space-x-3 mb-2">
                    {supportUrl && (
                      <span style={{ color: primaryColor }}>Support</span>
                    )}
                    {privacyUrl && (
                      <span style={{ color: primaryColor }}>Privacy</span>
                    )}
                    {securityUrl && (
                      <span style={{ color: primaryColor }}>Security</span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    © {new Date().getFullYear()} {project.name}
                    <br />
                    {companyAddress || "Company Address"}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-2">{footerText}</p>

                  <p className="text-[9px] text-gray-300 mt-3 uppercase tracking-wider">
                    Powered by AuthSphere
                  </p>
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
