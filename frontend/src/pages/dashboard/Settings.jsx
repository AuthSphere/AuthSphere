import React, { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Save,
  AlertCircle,
  UserCircle,
  Smartphone,
  Building2,
  Code,
  Zap,
  LayoutGrid,
  List,
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
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
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

  // Load full settings on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  // loadSettings moved above

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({ username: profileData.username });
      if (res.success) {
        setUser({ ...user, username: res.data.username });
        toast.success("Profile updated successfully!");
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
        toast.success("Organization info updated!");
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
        toast.success("Preferences saved!");
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

  if (settingsLoading) {
    return (
      <div className="container mx-auto py-10 px-6 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6 max-w-5xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Developer Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and developer experience.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto h-auto p-1 bg-muted/50">
          <TabsTrigger value="profile" className="gap-2 py-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2 py-2">
            <Building2 className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 py-2">
            <Code className="h-4 w-4" />
            API & Security
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2 py-2">
            <Zap className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>
                This information will be displayed on your developer profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center bg-muted overflow-hidden">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center max-w-25">
                    JPG, GIF or PNG. 1MB Max.
                  </p>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Developer Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        disabled
                        value={profileData.email}
                        className="pl-10 bg-muted/30"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Email cannot be changed for OAuth accounts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
              <Button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Theme Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between light, dark, and system themes.
                  </p>
                </div>
                <AnimatedThemeToggler />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Add details about your company or team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <Input
                  id="organization"
                  placeholder="Acme Inc."
                  value={orgData.organization}
                  onChange={(e) =>
                    setOrgData({ ...orgData, organization: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://acme.com"
                  value={orgData.website}
                  onChange={(e) =>
                    setOrgData({ ...orgData, website: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself or your organization..."
                  value={orgData.bio}
                  onChange={(e) =>
                    setOrgData({ ...orgData, bio: e.target.value })
                  }
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {orgData.bio.length}/500
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
              <Button
                onClick={handleOrgUpdate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Organization
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when projects are created or modified.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.email.projectUpdates}
                  onCheckedChange={(val) =>
                    updateNotificationPref("email", "projectUpdates", val)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security notifications and warnings.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.email.securityAlerts}
                  onCheckedChange={(val) =>
                    updateNotificationPref("email", "securityAlerts", val)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Summary of your week's activity and stats.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.email.weeklyDigest}
                  onCheckedChange={(val) =>
                    updateNotificationPref("email", "weeklyDigest", val)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New User Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when users sign up to your projects.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.email.newUserSignups}
                  onCheckedChange={(val) =>
                    updateNotificationPref("email", "newUserSignups", val)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications in the dashboard.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.inApp.enabled}
                  onCheckedChange={(val) =>
                    updateNotificationPref("inApp", "enabled", val)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when receiving notifications.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.inApp.sound}
                  onCheckedChange={(val) =>
                    updateNotificationPref("inApp", "sound", val)
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
              <Button
                onClick={handlePreferencesUpdate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API & Security Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Default settings for your API projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Rate Limit (requests/hour)</Label>
                <Input
                  type="number"
                  value={preferences.api.defaultRateLimit}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      api: {
                        ...preferences.api,
                        defaultRateLimit: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Applied to new projects by default.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CORS by Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow cross-origin requests for new projects.
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default View</Label>
                <Select
                  value={preferences.dashboard.defaultView}
                  onValueChange={(val) =>
                    setPreferences({
                      ...preferences,
                      dashboard: { ...preferences.dashboard, defaultView: val },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        Grid View
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        List View
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Items Per Page</Label>
                <Select
                  value={preferences.dashboard.itemsPerPage.toString()}
                  onValueChange={(val) =>
                    setPreferences({
                      ...preferences,
                      dashboard: {
                        ...preferences.dashboard,
                        itemsPerPage: parseInt(val),
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Display charts and metrics on dashboard.
                  </p>
                </div>
                <Switch
                  checked={preferences.dashboard.showAnalytics}
                  onCheckedChange={(val) =>
                    setPreferences({
                      ...preferences,
                      dashboard: {
                        ...preferences.dashboard,
                        showAnalytics: val,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
              <Button
                onClick={handlePreferencesUpdate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    View and manage devices signed into your account.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/settings/sessions" className="gap-2">
                    Manage <Globe className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that permanently affect your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-bold flex items-center gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove all projects, data, and settings.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-dashed border-primary/20">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-primary">Developer Compliance</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Deleting your account will immediately revoke all API keys for
                  your projects. Any applications relying on AuthSphere will
                  stop working instantly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
