import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from "@/api/ProjectAPI";

export const PROJECT_KEYS = {
  all: ["projects"],
  lists: () => [...PROJECT_KEYS.all, "list"],
  details: () => [...PROJECT_KEYS.all, "detail"],
  detail: (id) => [...PROJECT_KEYS.details(), id],
};

export const useProjects = (options = {}) => {
  return useQuery({
    queryKey: PROJECT_KEYS.lists(),
    queryFn: async () => {
      const res = await getProjects();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export const useProject = (projectId, options = {}) => {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(projectId),
    queryFn: async () => {
      const res = await getProject(projectId);
      return res.data || null;
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: PROJECT_KEYS.detail(variables.id),
        });
      }
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};

export default useProjects;
