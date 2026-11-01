import api from "./axios";

const ANALYTICS_BASE = "/analytics";

export const getAnalyticsOverview = async (projectId) => {
  const { data } = await api.get(`${ANALYTICS_BASE}/${projectId}/overview`);
  return data;
};

export const getAnalyticsCharts = async (projectId) => {
  const { data } = await api.get(`${ANALYTICS_BASE}/${projectId}/charts`);
  return data;
};

export const getRecentActivity = async (projectId) => {
  const { data } = await api.get(
    `${ANALYTICS_BASE}/${projectId}/recent-activity`,
  );
  return data;
};
