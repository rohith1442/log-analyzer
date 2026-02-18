import Log from "../models/Logs.js";
import { getIO } from "../socket.js";

class LogController {
  getLogs = async (req, res) => {
    try {
      const { level, service, start, end, limit, skip, search } = req.query;

      const pageSkip = Number(skip) || 0;
      const pageLimit = Number(limit) || 20;

      const filter = {};

      if (level) filter.level = level;
      if (service) filter.service = service;

      if (search) {
        filter.message = { $regex: search, $options: "i" };
      }

      if (start || end) {
        filter.timestamp = {};
        if (start) {
          const startDate = new Date(start);
          startDate.setHours(0, 0, 0, 0);
          filter.timestamp.$gte = startDate;
        }

        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          filter.timestamp.$lte = endDate;
        }
      }
      console.log(filter, skip, limit);

      const logs = await Log.find(filter)
        .sort({ timestamp: -1 })
        .skip(pageSkip)
        .limit(pageLimit);

      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getStats = async (req, res) => {
    try {
      const seconds = req.query.seconds;
      const stats = await this.emitStats(seconds);

      console.log("stats==========>", stats, seconds);

      const total = stats.reduce((sum, s) => sum + s.count, 0);
      const errorObj = stats.find((s) => s._id === "ERROR");
      const errorRate = total ? ((errorObj?.count || 0) / total) * 100 : 0;

      res.json({ stats, total, errorRate });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  generateLog = async () => {
    const levels = ["INFO", "WARN", "ERROR"];
    const services = ["auth", "payments", "notifications"];

    const log = await Log.create({
      level: levels[Math.floor(Math.random() * 3)],
      service: services[Math.floor(Math.random() * 3)],
      message: "System generated log",
    });
    // console.log(log)

    const io = getIO();

    // Emit new log
    io.sockets.sockets.forEach((socket) => {
      const f = socket.filters;

      if (!f) return;

      const matches =
        (!f.level || log.level === f.level) &&
        (!f.service || log.service === f.service);

      if (matches) {
        socket.emit("newLog", log);
      }
    });

    // Get updated stats
    const stats = await this.emitStats();

    // Emit updated stats
    io.emit("statsUpdate", stats);

    return log;
  };

  emitStats = async (seconds = 60) => {
    const since = new Date(Date.now() - seconds * 1000);

    const stats = await Log.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
    ]);
    return stats;
  };
}

export default new LogController();
