import { useEffect, useState, useCallback } from "react";
import {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  toggleUserBlock,
} from "@/api/ProjectAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  MoreVertical,
  RefreshCw,
  Ban,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Calendar,
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
import TechSeparator from "@/components/common/TechSeparator";

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

  const verifiedCount = users.filter((u) => u.isVerified).length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin mb-2" />
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          QUERYING DIRECTORY USERS...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-2">
      {/* ─── SECTION HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center">
              <span>02</span>
              <TechSeparator />
              <span>USER DIRECTORY &amp; RBAC</span>
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Identity Directory Management
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Audit registered identities, grant verified credentials, and enforce
            access blocks.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Search user or email..."
              className="pl-9 h-9 w-60 sm:w-68 font-mono text-xs border-[#eaeaea] dark:border-[#26262b] bg-white dark:bg-[#121316] placeholder:text-neutral-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-[#eaeaea] dark:border-[#26262b] bg-white dark:bg-[#121316] hover:bg-neutral-100 dark:hover:bg-[#1a1b22] text-neutral-900 dark:text-white cursor-pointer"
            onClick={fetchUsers}
            title="Refresh directory"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ─── METRIC TILES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            index: "01",
            label: "TOTAL DIRECTORY",
            value: users.length,
            desc: "Active user records enrolled",
            icon: Users,
            color: "text-neutral-900 dark:text-white",
          },
          {
            index: "02",
            label: "VERIFIED CREDENTIALS",
            value: verifiedCount,
            desc: `${users.length ? Math.round((verifiedCount / users.length) * 100) : 0}% verification rate`,
            icon: ShieldCheck,
            color: "text-emerald-500",
          },
          {
            index: "03",
            label: "ENFORCED BLOCKS",
            value: blockedCount,
            desc: "Prohibited by firewall policy",
            icon: Ban,
            color: blockedCount > 0 ? "text-red-500" : "text-neutral-400",
          },
        ].map((m) => (
          <div
            key={m.index}
            className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[10px] text-neutral-400 tracking-wider">
                {m.index} // {m.label}
              </span>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                {m.value}
              </span>
              <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-1">
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── USERS DIRECTORY TABLE ─── */}
      <div className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316] rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-[#eaeaea] dark:border-[#222329] flex items-center justify-between text-xs font-mono bg-neutral-50/70 dark:bg-[#14151a]">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            REGISTERED PRINCIPALS ({filteredUsers.length})
          </span>
          <span className="text-[10px] text-neutral-500">
            SPEC: SCIM / OIDC
          </span>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="h-10 w-10 mx-auto mb-3 text-neutral-300 dark:text-neutral-700" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-1">
              Empty Identity Directory
            </h3>
            <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
              Users will appear in this registry once they authenticate through
              your connected providers or passwordless flow.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#eaeaea] dark:border-[#222329] text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50/40 dark:bg-[#14151a]/40">
                  <th className="px-6 py-3 font-semibold uppercase">
                    Principal User
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase">
                    Verification
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase">
                    Auth Provider
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea] dark:divide-[#222329]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-neutral-50/80 dark:hover:bg-[#16171e] transition-colors ${
                      user.isBlocked ? "opacity-60 bg-red-50/10" : ""
                    }`}
                  >
                    {/* User Identity */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg border border-[#eaeaea] dark:border-[#26262b]">
                          <AvatarImage
                            src={
                              user.picture ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                            }
                          />
                          <AvatarFallback className="bg-neutral-100 dark:bg-[#181920] text-neutral-900 dark:text-white text-xs font-bold rounded-lg">
                            {user.username?.substring(0, 2).toUpperCase() ||
                              "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate font-sans">
                            {user.username || "Anonymous User"}
                          </p>
                          <p className="text-[11px] text-neutral-500 font-mono truncate max-w-56">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3" /> UNVERIFIED
                          </span>
                        )}
                        {user.isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                            <Ban className="h-3 w-3" /> BLOCKED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded border border-[#eaeaea] dark:border-[#26262b] bg-neutral-100 dark:bg-[#16171d] text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                        {user.provider || "LOCAL"}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-3.5 text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {format(new Date(user.createdAt), "yyyy-MM-dd")}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="px-6 py-3.5 text-right">
                      {actionLoading === user._id ? (
                        <div className="w-4 h-4 border-2 border-neutral-300 border-t-black dark:border-t-white rounded-full animate-spin ml-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 font-mono text-xs border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#121316]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleToggleVerify(user._id)}
                              className="gap-2 cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                              {user.isVerified
                                ? "Mark Unverified"
                                : "Mark Verified"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleToggleBlock(user._id)}
                              className="gap-2 cursor-pointer"
                            >
                              {user.isBlocked ? (
                                <>
                                  <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>Unblock Principal</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Block Principal</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-[#eaeaea] dark:bg-[#222329]" />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div className="flex items-center gap-2 px-2 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer">
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Purge User Record</span>
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="border border-[#eaeaea] dark:border-[#222329] bg-white dark:bg-[#0c0d10] font-mono text-xs">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-base text-neutral-900 dark:text-white">
                                    Purge User Account?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-neutral-500">
                                    This action permanently deletes the user's
                                    sessions and identity records from the
                                    namespace. This operation cannot be
                                    reversed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-3">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Confirm Purge
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
      </div>
    </div>
  );
};

export default ProjectUsersCard;
