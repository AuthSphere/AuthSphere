import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeveloperSettings,
  updateProfile,
  updatePreferences,
  updateOrganization,
} from "@/api/DeveloperAPI";

export const SETTINGS_KEYS = {
  all: ["settings"],
  developer: () => [...SETTINGS_KEYS.all, "developer"],
};

export const useDeveloperSettings = (options = {}) => {
  return useQuery({
    queryKey: SETTINGS_KEYS.developer(),
    queryFn: async () => {
      const res = await getDeveloperSettings();
      if (!res?.success) {
        throw new Error(res?.message || "Failed to load developer settings");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
    },
  });
};

export default useDeveloperSettings;
