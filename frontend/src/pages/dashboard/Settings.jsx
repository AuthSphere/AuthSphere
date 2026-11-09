import React, { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Bell,
  Palette,
  Globe,
  Trash2,
  Save,
  AlertCircle,
  UserCircle,
  Building2,
  Code,
  Zap,
  LayoutGrid,
  List,
  Shield,
  KeyRound,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Link, useNavigate } from "react-router-dom";
import {
  updateProfile,
  deleteAccount,
  getDeveloperSettings,
  updatePreferences,
  updateOrganization,
} from "@/api/DeveloperAPI";
import TechSeparator from "@/components/common/TechSeparator";

const Settings = () => {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Profile State
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // Organization State
  const [orgData, setOrgData] = useState({
    organization: "",
    website: "",
    bio: "",
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    notifications: {
      email: {
        projectUpdates: true,
        securityAlerts: true,
        weeklyDigest: false,
        newUserSignups: false,
      },
      inApp: {
        enabled: true,
        sound: false,
      },
    },
    api: {
      defaultRateLimit: 1000,
      enableCors: true,
      allowedIPs: [],
    },
    dashboard: {
      defaultView: "grid",
      itemsPerPage: 10,
      showAnalytics: true,
    },
  });

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await getDeveloperSettings();
      if (res.success) {
        const dev = res.data;
        setOrgData({
          organization: dev.organization || "",
          website: dev.website || "",
          bio: dev.bio || "",
        });
        if (dev.preferences) {
          setPreferences(dev.preferences);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({ username: profileData.username });
      if (res.success) {
        setUser({ ...user, username: res.data.username });
        toast.success("Profile credentials updated!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateOrganization(orgData);
      if (res.success) {
        toast.success("Organization metadata updated!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      setLoading(true);
      const res = await updatePreferences(preferences);
      if (res.success) {
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "CRITICAL WARNING: This will permanently delete your AuthSphere account and ALL associated projects. This action cannot be undone. Are you absolutely sure?",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await deleteAccount();
      if (res.success) {
        toast.success("Account deleted. We're sorry to see you go.");
        logout();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPref = (category, key, value) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category],
          [key]: value,
        },
      },
    }));
  };

  const tabs = [
    { id: "profile", label: "PROFILE", index: "01", icon: User },
    { id: "organization", label: "ORGANIZATION", index: "02", icon: Building2 },
    { id: "notifications", label: "NOTIFICATIONS", index: "03", icon: Bell },
    { id: "api", label: "API & SECURITY", index: "04", icon: Code },
    { id: "advanced", label: "DANGER ZONE", index: "05", icon: Trash2 },
  ];

  if (settingsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        <span className="text-muted-foreground">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased relative isolate selection:bg-primary selection:text-primary-foreground">
      {/* Precision Engineering Matrix Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-matrix opacity-40 dark:opacity-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-muted/50 dark:to-background/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Engineering Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
          <div className="flex items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <span>04</span>
            <TechSeparator />
            <span>ACCOUNT SETTINGS</span>
            <TechSeparator />
            <span>PREFERENCES</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACCOUNT VERIFIED</span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Developer Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your profile, notifications, and API security controls.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-8 font-mono text-xs border-border"
          >
            <Link to="/settings/sessions" className="gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>ACTIVE SESSIONS →</span>
            </Link>
          </Button>
        </div>

        {/* Technical Sub-tab Bar */}
        <div className="border-b border-border flex items-center gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                  isActive
                    ? "border-primary text-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-[10px] text-muted-foreground font-normal">
                  [{tab.index}]
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 01: Profile */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground uppercase">
                  01 // PUBLIC IDENTITY RECORD
                </span>
                <span className="text-muted-foreground text-[10px]">
                  AUTH_MODE: OAUTH
                </span>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      AVATAR
                    </span>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="username"
                        className="text-xs font-mono text-muted-foreground"
                      >
                        DEVELOPER USERNAME
                      </Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        className="h-9 text-xs font-mono bg-background border-input text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-mono text-muted-foreground"
                      >
                        PRIMARY EMAIL ADDRESS
                      </Label>
                      <Input
                        id="email"
                        disabled
                        value={profileData.email}
                        className="h-9 text-xs font-mono bg-muted border-input text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-[10px] font-mono text-muted-foreground">
                        Primary account email address associated with your
                        registration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="h-8 px-4 text-xs font-mono"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {loading ? "SAVING..." : "SAVE PROFILE"}
                </Button>
              </div>
            </div>

            {/* Appearance Card */}
            <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground uppercase">
                  APPEARANCE &amp; THEME
                </span>
                <span className="text-muted-foreground text-[10px]">
                  CSS_VARS
                </span>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-semibold text-foreground">
                    SYSTEM THEME PREFERENCE
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle between engineering dark mode and daylight
                    high-contrast palette.
                  </p>
                </div>
                <AnimatedThemeToggler />
              </div>
            </div>
          </div>
        )}

        {/* Tab 02: Organization */}
        {activeTab === "organization" && (
          <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-foreground uppercase">
                02 // ORGANIZATION METADATA
              </span>
              <span className="text-muted-foreground text-[10px]">
                TENANT_SCOPE
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="organization"
                  className="text-xs font-mono text-muted-foreground"
                >
                  COMPANY / ORG NAME
                </Label>
                <Input
                  id="organization"
                  placeholder="e.g. Synthetix Labs"
                  value={orgData.organization}
                  onChange={(e) =>
                    setOrgData({ ...orgData, organization: e.target.value })
                  }
                  className="h-9 text-xs font-mono bg-background border-input text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="website"
                  className="text-xs font-mono text-muted-foreground"
                >
                  OFFICIAL URL
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://synthetix.dev"
                  value={orgData.website}
                  onChange={(e) =>
                    setOrgData({ ...orgData, website: e.target.value })
                  }
                  className="h-9 text-xs font-mono bg-background border-input text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="bio"
                  className="text-xs font-mono text-muted-foreground"
                >
                  DEVELOPER BIOGRAPHY
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Engineering team developing distributed infrastructure..."
                  value={orgData.bio}
                  onChange={(e) =>
                    setOrgData({ ...orgData, bio: e.target.value })
                  }
                  rows={4}
                  maxLength={500}
                  className="text-xs font-mono bg-background border-input text-foreground"
                />
                <p className="text-[10px] font-mono text-muted-foreground text-right">
                  {orgData.bio.length} / 500 CHARACTERS
                </p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
              <Button
                onClick={handleOrgUpdate}
                disabled={loading}
                className="h-8 px-4 text-xs font-mono"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {loading ? "SAVING..." : "SAVE ORGANIZATION"}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 03: Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground uppercase">
                  03 // EMAIL DISPATCH CHANNELS
                </span>
                <span className="text-muted-foreground text-[10px]">
                  SMTP_GATEWAY
                </span>
              </div>
              <div className="p-6 divide-y divide-border">
                <div className="flex items-center justify-between py-3 first:pt-0">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-mono font-semibold text-foreground">
                      PROJECT CONFIGURATION UPDATES
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Dispatched when API keys are rotated or webhooks modified.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email.projectUpdates}
                    onCheckedChange={(val) =>
                      updateNotificationPref("email", "projectUpdates", val)
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-mono font-semibold text-foreground">
                      SECURITY &amp; AUTHENTICATION ALERTS
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Suspicious activity alerts, rate limit warnings, and
                      session revocations.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email.securityAlerts}
                    onCheckedChange={(val) =>
                      updateNotificationPref("email", "securityAlerts", val)
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-mono font-semibold text-foreground">
                      WEEKLY ACTIVITY DIGEST
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Summary of authentication volume, sign-in activity, and
                      provider distribution.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email.weeklyDigest}
                    onCheckedChange={(val) =>
                      updateNotificationPref("email", "weeklyDigest", val)
                    }
                  />
                </div>
              </div>
              <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
                <Button
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                  className="h-8 px-4 text-xs font-mono"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {loading ? "SAVING..." : "SAVE PREFERENCES"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 04: API & Security */}
        {activeTab === "api" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground uppercase">
                  04 // DEFAULT API POLICIES
                </span>
                <span className="text-muted-foreground text-[10px]">
                  CORS // RATE_LIMIT
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">
                    DEFAULT RATE LIMIT (REQ / HR)
                  </Label>
                  <Input
                    type="number"
                    value={preferences.api.defaultRateLimit}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        api: {
                          ...preferences.api,
                          defaultRateLimit: parseInt(e.target.value) || 1000,
                        },
                      })
                    }
                    className="h-9 text-xs font-mono bg-background border-input text-foreground"
                  />
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Default rate limit threshold applied to newly created
                    projects.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-mono font-semibold text-foreground">
                      ENABLE STRICT CORS BY DEFAULT
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Restrict browser origin preflights to whitelisted frontend
                      endpoints.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.api.enableCors}
                    onCheckedChange={(val) =>
                      setPreferences({
                        ...preferences,
                        api: { ...preferences.api, enableCors: val },
                      })
                    }
                  />
                </div>
              </div>
              <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
                <Button
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                  className="h-8 px-4 text-xs font-mono"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {loading ? "SAVING..." : "SAVE POLICIES"}
                </Button>
              </div>
            </div>

            {/* Active Sessions Quick-Link */}
            <div className="rounded-xl border border-border bg-card text-card-foreground p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>ACTIVE USER SESSIONS</span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  View active device sessions, IP addresses, and revoke access.
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="h-8 font-mono text-xs border-border"
              >
                <Link to="/settings/sessions" className="gap-2">
                  <span>MANAGE SESSIONS</span>
                  <Globe className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Tab 05: Danger Zone */}
        {activeTab === "advanced" && (
          <div className="rounded-xl border border-destructive/30 bg-card text-card-foreground overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-destructive/20 bg-destructive/10 flex items-center justify-between text-xs font-mono text-destructive">
              <span className="font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>05 // DANGER ZONE // IRREVERSIBLE ACTION</span>
              </span>
              <span>CONFIRMATION REQUIRED</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-destructive">
                    PERMANENTLY DELETE ACCOUNT
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    Instantly revokes all API keys, terminates connected
                    sessions, and permanently deletes your projects and users.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="h-9 px-4 text-xs font-mono shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {loading ? "DELETING..." : "DELETE ACCOUNT"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
