import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";

/**
 * Management APIs for AuthSphere.
 * Note: These require a valid developer token (JWT).
 */

/**
 * Fetch all end-users for a specific project.
 */
export async function getProjectUsers(
  projectId: string,
  developerToken: string,
) {
  const options = getConfig();
  const response = await fetch(
    `${options.baseUrl}/projects/${projectId}/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Failed to fetch project users");
  }

  return data;
}

/**
 * Delete a specific end-user from a project.
 */
export async function deleteProjectUser(
  projectId: string,
  userId: string,
  developerToken: string,
) {
  const options = getConfig();
  const response = await fetch(
    `${options.baseUrl}/projects/${projectId}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Failed to delete user");
  }

  return data;
}

/**
 * Toggle the verification status of an end-user.
 */
export async function toggleUserVerification(
  projectId: string,
  userId: string,
  developerToken: string,
) {
  const options = getConfig();
  const response = await fetch(
    `${options.baseUrl}/projects/${projectId}/users/${userId}/verify`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Failed to toggle user verification");
  }

  return data;
}
