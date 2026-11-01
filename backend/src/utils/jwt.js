import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";

export const generateAccessToken = (developerId) => {
  return jwt.sign({ _id: developerId }, conf.accessTokenSecret, {
    expiresIn: conf.accessTokenExpiry || "1d",
  });
};

export const generateRefreshToken = (developerId) => {
  return jwt.sign({ _id: developerId }, conf.refreshTokenSecret, {
    expiresIn: conf.refreshTokenExpiry || "10d",
  });
};
