import EndUser from "../../models/endUsers.models.js";
import Session from "../../models/session.model.js";
import mongoose from "mongoose";
import redisService from "./redis.service.js";

class AnalyticsService {
  /**
   * Helper to get date ranges
   */
  getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfPeriod = new Date(today);
    startOfPeriod.setDate(startOfPeriod.getDate() - 29);

    const startOfPrevPeriod = new Date(startOfPeriod);
    startOfPrevPeriod.setDate(startOfPrevPeriod.getDate() - 30);

    return { now, today, startOfPeriod, startOfPrevPeriod };
  }

  /**
   * Calculate percentage trend
   */
  calcTrend(curr, prev) {
    if (prev === 0) return curr > 0 ? "+100%" : "0%";
    const diff = ((curr - prev) / prev) * 100;
    return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
  }

  /**
   * Get overview stats for a project
   */
  async getOverview(projectId) {
    return await redisService.getOrSetCache(
      `analytics:overview:${projectId}`,
      () => this._fetchOverview(projectId),
    );
  }

  async _fetchOverview(projectId) {
    const { today, startOfPeriod, startOfPrevPeriod } = this.getDateRanges();
    const pId = new mongoose.Types.ObjectId(projectId);

    const [
      signupsMonth,
      signupsPrevMonth,
      loginsToday,
      loginsYesterday,
      mau,
      totalUsers,
    ] = await Promise.all([
      EndUser.countDocuments({
        projectId: pId,
        createdAt: { $gte: startOfPeriod },
      }),
      EndUser.countDocuments({
        projectId: pId,
        createdAt: { $gte: startOfPrevPeriod, $lt: startOfPeriod },
      }),
      Session.countDocuments({ projectId: pId, createdAt: { $gte: today } }),
      Session.countDocuments({
        projectId: pId,
        createdAt: {
          $gte: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          $lt: today,
        },
      }),
      Session.distinct("endUserId", {
        projectId: pId,
        createdAt: { $gte: startOfPeriod },
        isValid: true,
      }).then((ids) => ids.length),
      EndUser.countDocuments({ projectId: pId }),
    ]);

    return {
      signups: {
        month: signupsMonth,
        trend: this.calcTrend(signupsMonth, signupsPrevMonth),
      },
      logins: {
        today: loginsToday,
        trend: this.calcTrend(loginsToday, loginsYesterday),
      },
      activeUsers: {
        mau,
        retention:
          totalUsers > 0 ? ((mau / totalUsers) * 100).toFixed(1) + "%" : "0%",
      },
      health: {
        latency: "102ms",
        uptime: "99.99%",
      },
    };
  }

  /**
   * Get chart data for a project
   */
  async getCharts(projectId) {
    return await redisService.getOrSetCache(
      `analytics:charts:${projectId}`,
      () => this._fetchCharts(projectId),
    );
  }

  async _fetchCharts(projectId) {
    const { startOfPeriod } = this.getDateRanges();
    const pId = new mongoose.Types.ObjectId(projectId);

    const [rawDailySignups, rawDailyActiveUsers, providerBreakdown] =
      await Promise.all([
        EndUser.aggregate([
          { $match: { projectId: pId, createdAt: { $gte: startOfPeriod } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Session.aggregate([
          { $match: { projectId: pId, createdAt: { $gte: startOfPeriod } } },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                userId: "$endUserId",
              },
            },
          },
          {
            $group: {
              _id: "$_id.date",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        EndUser.aggregate([
          { $match: { projectId: pId } },
          {
            $group: {
              _id: "$provider",
              value: { $sum: 1 },
            },
          },
          {
            $project: {
              name: { $cond: [{ $eq: ["$_id", "local"] }, "Email", "$_id"] },
              value: 1,
              _id: 0,
            },
          },
          { $sort: { value: -1 } },
        ]),
      ]);

    const dailySignups = [];
    const dailyActiveUsers = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startOfPeriod);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const signupFound = rawDailySignups.find((d) => d._id === dateStr);
      dailySignups.push({
        date: dateStr,
        count: signupFound ? signupFound.count : 0,
      });

      const activeFound = rawDailyActiveUsers.find((d) => d._id === dateStr);
      dailyActiveUsers.push({
        date: dateStr,
        count: activeFound ? activeFound.count : 0,
      });
    }

    return {
      dailySignups,
      dailyActiveUsers,
      providerDistribution: providerBreakdown,
    };
  }

  /**
   * Get recent activity for a project
   */
  async getRecentActivity(projectId, limit = 10) {
    return await redisService.getOrSetCache(
      `analytics:recent:${projectId}:${limit}`,
      () => this._fetchRecentActivity(projectId, limit),
    );
  }

  async _fetchRecentActivity(projectId, limit = 10) {
    const pId = new mongoose.Types.ObjectId(projectId);

    const recentSessions = await Session.find({ projectId: pId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("endUserId", "username email picture provider");

    return {
      recentLogins: recentSessions.map((s) => ({
        user: s.endUserId ? s.endUserId.username : "Unknown",
        email: s.endUserId ? s.endUserId.email : "Unknown",
        picture: s.endUserId ? s.endUserId.picture : null,
        provider: s.endUserId ? s.endUserId.provider : "local",
        timestamp: s.createdAt,
        device: s.userAgent || "Desktop",
      })),
    };
  }
}

export default new AnalyticsService();
