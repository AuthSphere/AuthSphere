import sdkService from "../services/auth/sdk.service.js";
import { conf } from "../configs/env.js";
import { emitEvent } from "../services/core/socket.service.js";
import { triggerWebhook } from "../utils/webhookSender.js";
import { logEvent } from "../utils/auditLogger.js";
import Session from "../models/session.model.js";
import logger from "../utils/logger.js";
import { successResponse } from "../utils/response.js";
import { catchAsync, AppError } from "../utils/AppError.js";

import { renderProviderNotEnabled } from "../utils/errorPages.js";

export const authRequests = sdkService.authRequests;
export const authCodes = sdkService.authCodes;

// ---------------------------
// SDK AUTHORIZE ROUTE
// ---------------------------
export const authorize = catchAsync(async (req, res, next) => {
  let project;
  try {
    project = await sdkService.validateAuthorizeRequest(req.query);
  } catch (error) {
    if (error.isProviderNotEnabled) {
      return res
        .status(403)
        .send(renderProviderNotEnabled(error.provider, error.projectName));
    }
    return next(error);
  }

  const requestId = sdkService.createAuthRequest(req.query, project._id);

  logger.info(`SDK Auth request created: ${requestId}`);

  emitEvent(project._id, "AUTH_REQUEST", {
    requestId,
    provider: req.query.provider,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  if (req.headers.accept === "application/json" || req.query.json === "true") {
    return successResponse(res, "Auth request created", { requestId });
  }

  if (req.query.provider.toLowerCase() === "local") {
    return res.redirect(`${conf.frontendUrl}/login?sdk_request=${requestId}`);
  }

  return res.redirect(
    `/auth/${req.query.provider.toLowerCase()}?sdk=true&sdk_request=${requestId}`,
  );
});

// ---------------------------
// SDK CALLBACK
// ---------------------------
export const handleSDKCallback = async (
  req,
  res,
  endUser,
  provider,
  manualSdkRequestId,
) => {
  try {
    const sdk_request = manualSdkRequestId || req.query.sdk_request;
    if (!sdk_request) return null;

    const authRequest = await sdkService.getAuthRequest(sdk_request);
    if (!authRequest) {
      return res.status(400).send("Invalid or expired request");
    }

    const { project } = await sdkService
      .getProjectAndUser(authRequest.projectId, endUser.email)
      .catch((err) => {
        logger.error("Project fetch error:", { error: err });
        return { project: null };
      });

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const verificationRequired = await sdkService.handleEmailVerification(
      endUser,
      project,
      sdk_request,
      reqInfo,
    );

    if (verificationRequired) {
      const redirectUrl = new URL(authRequest.redirectUri);
      redirectUrl.searchParams.set("error", "email_not_verified");
      redirectUrl.searchParams.set("email", endUser.email);
      redirectUrl.searchParams.set("sdk_request", sdk_request);

      if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.json({ success: false, redirect: redirectUrl.toString() });
      }
      return res.redirect(redirectUrl.toString());
    }

    const code = sdkService.issueAuthCode(authRequest, endUser);
    sdkService.deleteAuthRequest(sdk_request);

    emitEvent(authRequest.projectId, "AUTH_CODE_ISSUED", {
      email: endUser.email,
      provider: endUser.provider || "local",
    });

    const redirectUrl = new URL(authRequest.redirectUri);
    redirectUrl.searchParams.set("code", code);
    redirectUrl.searchParams.set("state", authRequest.state);

    if (
      req.xhr ||
      req.headers.accept?.includes("application/json") ||
      req.body?.sdk_request
    ) {
      return res.json({ success: true, redirect: redirectUrl.toString() });
    }
    return res.redirect(redirectUrl.toString());
  } catch (err) {
    logger.error("SDK callback error:", { error: err });
    return res.status(500).send("Authentication failed");
  }
};

// ---------------------------
// TOKEN EXCHANGE
// ---------------------------
export const token = catchAsync(async (req, res) => {
  const { code, client_id, public_key, code_verifier } = req.body;
  const clientId = client_id || public_key;

  logger.info("Token Endpoint Params:", {
    code: code ? "Present" : "Missing",
    clientId,
    hasVerifier: !!code_verifier,
  });

  if (!code) {
    throw new AppError("Missing code", 400);
  }

  const authData = await sdkService.getAuthCode(code);
  if (!authData) {
    throw new AppError("Invalid or expired code", 400);
  }

  await sdkService.verifyPKCE(authData, code_verifier);

  if (clientId && clientId !== authData.publicKey) {
    throw new AppError("invalid_client", 400);
  }

  const { project } = await sdkService
    .getProjectAndUser(authData.projectId, authData.endUser.email)
    .catch(() => ({ project: null }));

  if (!project) throw new AppError("invalid_client", 400);

  // CORS Check
  const origin = req.headers.origin;
  if (
    project.allowedOrigins?.length > 0 &&
    (!origin || !project.allowedOrigins.includes(origin))
  ) {
    throw new AppError("CORS: Origin not allowed", 403);
  }

  sdkService.deleteAuthCode(code);

  const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
  const result = await sdkService.createSession(
    authData.endUser,
    project,
    reqInfo,
  );

  triggerWebhook(project._id, "user.login", {
    userId: authData.endUser._id,
    email: authData.endUser.email,
    username: authData.endUser.username,
    provider: authData.endUser.provider || "local",
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  emitEvent(project._id, "TOKEN_EXCHANGED", {
    email: authData.endUser.email,
    userId: authData.endUser._id,
    ip: req.ip,
  });

  return successResponse(res, "Token exchanged successfully", {
    ...result,
    user: {
      id: authData.endUser._id,
      email: authData.endUser.email,
      username: authData.endUser.username,
      picture: authData.endUser.picture || "",
      provider: authData.endUser.provider || "local",
    },
  });
});

// ---------------------------
// REFRESH TOKEN
// ---------------------------
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Missing refresh token",
      });

    const session = await Session.findOne({
      token: refreshToken,
      isValid: true,
    }).populate("endUserId");
    if (!session || new Date() > session.expiresAt) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired token",
      });
    }

    const { project } = await sdkService
      .getProjectAndUser(session.projectId, session.endUserId.email)
      .catch(() => ({ project: null }));

    if (!project) return res.status(400).json({ error: "invalid_client" });

    // CORS Check
    const origin = req.headers.origin;
    if (
      project.allowedOrigins?.length > 0 &&
      (!origin || !project.allowedOrigins.includes(origin))
    ) {
      return res.status(403).json({
        error: "access_denied",
        error_description: "CORS: Origin not allowed",
      });
    }

    const result = await sdkService.createSession(session.endUserId, project, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    emitEvent(session.projectId, "TOKEN_REFRESHED", {
      email: session.endUserId.email,
      userId: session.endUserId._id,
    });

    await logEvent({
      projectId: session.projectId,
      action: "TOKEN_REFRESHED",
      description: `Session tokens refreshed for user (${session.endUserId.email}).`,
      category: "security",
      actor: {
        type: "user",
        id: session.endUserId._id.toString(),
        name: session.endUserId.email,
      },
      metadata: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        resourceId: session._id,
      },
    });

    return res.json({ success: true, ...result });
  } catch (err) {
    logger.error("Token Refresh Error:", { error: err });
    return res.status(500).json({ error: "server_error" });
  }
};

// ---------------------------
// LOCAL AUTH (Email/Password)
// ---------------------------
export const registerLocal = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      public_key,
      publicKey,
      projectId,
      sdk_request,
    } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !username || !actualPublicKey || !projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    await sdkService.registerLocal(
      { email, password, username, actualPublicKey, projectId, sdk_request },
      reqInfo,
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please enter the OTP sent to your email.",
      requireEmailVerification: true,
    });
  } catch (err) {
    return res
      .status(err.message.includes("exists") ? 400 : 500)
      .json({ success: false, message: err.message });
  }
};

export const loginLocal = async (req, res) => {
  try {
    const { email, password, public_key, publicKey, projectId, sdk_request } =
      req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !password || !actualPublicKey || !projectId || !sdk_request) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const { user, project } = await sdkService.loginLocal({
      email,
      password,
      actualPublicKey,
      projectId,
    });

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    const verificationRequired = await sdkService.handleEmailVerification(
      user,
      project,
      sdk_request,
      reqInfo,
    );

    if (verificationRequired) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. A new code has been sent.",
        error_code: "EMAIL_NOT_VERIFIED",
        sdk_request,
      });
    }

    return await handleSDKCallback(req, res, user, "local", sdk_request);
  } catch (err) {
    return res
      .status(err.message.includes("credentials") ? 401 : 500)
      .json({ success: false, message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    const { user } = await sdkService.verifyOTP(email, otp, actualPublicKey);
    return await handleSDKCallback(req, res, user, user.provider, sdk_request);
  } catch (err) {
    return res
      .status(err.message.includes("expired") ? 400 : 500)
      .json({ success: false, message: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email, public_key, publicKey, sdk_request } = req.body;
    const actualPublicKey = public_key || publicKey;

    if (!email || !actualPublicKey || !sdk_request) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const reqInfo = { ip: req.ip, userAgent: req.headers["user-agent"] };
    await sdkService.resendOTP(email, actualPublicKey, sdk_request, reqInfo);

    return res.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
