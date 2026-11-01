import developerService from "../services/core/developer.service.js";
import Developer from "../models/developer.model.js";

// ✅ CONSISTENT COOKIE OPTIONS
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

/* ---------------------- REGISTER ---------------------- */
export const registerDeveloper = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ([email, username, password].some((f) => f?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const developer = await developerService.register(req.body);
    return res.status(201).json({
      success: true,
      message: "Developer registered successfully",
      data: developer,
    });
  } catch (error) {
    const status = error.message.includes("exists") ? 409 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/* ---------------------- LOGIN ---------------------- */
export const loginDeveloper = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const reqInfo = {
      ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "",
    };
    const { developer, accessToken, refreshToken } =
      await developerService.login(email, password, reqInfo);

    const options = getCookieOptions();
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Logged in successfully",
        developer: {
          id: developer._id,
          username: developer.username,
          email: developer.email,
          picture: developer.picture,
        },
        accessToken,
      });
  } catch (error) {
    const status =
      error.message.includes("Invalid") ||
      error.message.includes("does not exist")
        ? 401
        : 400;
    return res.status(status).json({ message: error.message });
  }
};

/* ---------------------- REFRESH TOKEN ---------------------- */
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const { accessToken, newRefreshToken } =
      await developerService.refreshTokens(incomingRefreshToken);

    const options = getCookieOptions();
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        success: true,
        message: "Tokens refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/* ---------------------- LOGOUT ---------------------- */
export const logoutDeveloper = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await developerService.logout(req.developer._id, refreshToken);

    const options = getCookieOptions();
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------------- GET PROFILE ---------------------- */
export const getCurrentDeveloper = async (req, res) => {
  if (!req.developer) {
    return res.status(404).json({
      success: false,
      message: "Developer profile not found",
    });
  }
  return res.status(200).json({ success: true, data: req.developer });
};

/* ---------------------- DASHBOARD STATS ---------------------- */
export const getDashboardStats = async (req, res) => {
  try {
    const data = await developerService.getDashboardStats(req.developer._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE PROFILE ---------------------- */
export const updateDeveloperProfile = async (req, res) => {
  try {
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const updated = await developerService.updateProfile(
      req.developer._id,
      req.body,
      reqInfo,
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    const status = error.message.includes("taken") ? 409 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/* ---------------------- DELETE ACCOUNT ---------------------- */
export const deleteDeveloperAccount = async (req, res) => {
  try {
    await developerService.deleteAccount(req.developer._id);
    const options = getCookieOptions();
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ success: true, message: "Account deleted permanently" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE PREFERENCES ---------------------- */
export const updateDeveloperPreferences = async (req, res) => {
  try {
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const updated = await developerService.updatePreferences(
      req.developer._id,
      req.body.preferences,
      reqInfo,
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE ORGANIZATION INFO ---------------------- */
export const updateDeveloperOrganization = async (req, res) => {
  try {
    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const updated = await developerService.updateOrganization(
      req.developer._id,
      req.body,
      reqInfo,
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------------------- GET FULL SETTINGS ---------------------- */
export const getDeveloperSettings = async (req, res) => {
  try {
    const developer = await Developer.findById(req.developer._id).select(
      "-password -refreshToken",
    );
    if (!developer)
      return res.status(404).json({ message: "Developer not found" });
    return res.status(200).json({ success: true, data: developer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
