import api from "./axios";

export const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/developers/stats");
    return data;
  } catch (error) {
    if (error?.response?.data) {
      throw new Error(error.response.data.message || "Failed to fetch stats");
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/developers/profile", profileData);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete("/developers/account");
  return data;
};

// New Settings APIs
export const getDeveloperSettings = async () => {
  const { data } = await api.get("/developers/settings");
  return data;
};

export const updatePreferences = async (preferences) => {
  const { data } = await api.put("/developers/preferences", { preferences });
  return data;
};

export const updateOrganization = async (orgData) => {
  const { data } = await api.put("/developers/organization", orgData);
  return data;
};
