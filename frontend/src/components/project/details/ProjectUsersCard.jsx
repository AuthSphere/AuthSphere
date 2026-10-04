import { useEffect, useState, useCallback } from "react";
import {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  toggleUserBlock,
} from "@/api/ProjectAPI";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Loader2,
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  UserX,
  RefreshCw,
  Ban,
  Unlock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProjectUsersCard = ({ projectId }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjectUsers(projectId);
      if (res.success) setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (projectId) fetchUsers();
  }, [projectId, fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await deleteProjectUser(projectId, userId);
      if (res.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u._id !== userId));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await toggleUserVerification(projectId, userId);
      if (res.success) {
        toast.success(res.message);
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isVerified: !u.isVerified } : u,
          ),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update verification");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await toggleUserBlock(projectId, userId);
      if (res.success) {
        toast.success(res.message);
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u,
          ),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update block status");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage user accounts, verification, and access control.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9 h-9 w-64 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={fetchUsers}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: users.length,
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "Verified",
            value: users.filter((u) => u.isVerified).length,
            icon: ShieldCheck,
            color: "text-emerald-500",
          },
          {
            label: "Blocked",
            value: users.filter((u) => u.isBlocked).length,
            icon: Ban,
            color: "text-red-500",
          },
        ].map((metric, i) => (
          <Card
            key={i}
            className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                <metric.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="bg-card/30 border-border/50">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <h3 className="font-semibold text-base mb-1">No users yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Users will appear here once they register through your
              authentication flow.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-muted/30 transition-colors ${user.isBlocked ? "opacity-60" : ""}`}
                  >
                    {/* User */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user.picture ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                            }
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.username?.substring(0, 2).toUpperCase() ||
                              "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {user.isVerified ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 text-emerald-500"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 text-amber-500"
                          >
                            <AlertTriangle className="h-3 w-3" /> Unverified
                          </Badge>
                        )}
                        {user.isBlocked && (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 text-red-500"
                          >
                            <Ban className="h-3 w-3" /> Blocked
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.provider}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right">
                      {actionLoading === user._id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => handleToggleVerify(user._id)}
                            >
                              {user.isVerified ? (
                                <>
                                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                                  Revoke Verification
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                  Verify User
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => handleToggleBlock(user._id)}
                            >
                              {user.isBlocked ? (
                                <>
                                  <Unlock className="h-4 w-4 text-emerald-500" />
                                  Unblock User
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 text-red-500" />
                                  Block User
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="gap-2 text-destructive cursor-pointer"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="h-6 w-6 text-destructive" />
                                  </div>
                                  <AlertDialogTitle className="text-center">
                                    Delete User?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-center">
                                    This will permanently delete{" "}
                                    <strong>{user.email}</strong> and all
                                    associated data. This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => handleDelete(user._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* No search results */}
      {filteredUsers.length === 0 && users.length > 0 && (
        <Card className="bg-card/30 border-border/50">
          <div className="text-center py-12">
            <UserX className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-medium mb-1">No results found</p>
            <p className="text-xs text-muted-foreground mb-4">
              No users match your search query.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        </Card>
      )}

      {/* Controls Info */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">About Controls</CardTitle>
          <CardDescription className="text-xs">
            Actions available from the user menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted text-emerald-500 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5">Verification</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verified users have confirmed email ownership. If email
                  verification is required in settings, unverified users cannot
                  authenticate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted text-red-500 shrink-0">
                <Ban className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5">Blocking</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Blocked users retain their profile for auditing but all login
                  attempts are rejected. Active sessions are terminated
                  immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5">Deletion</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Permanently removes the user and all associated data. This is
                  irreversible — consider blocking instead to preserve audit
                  trails.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectUsersCard;
