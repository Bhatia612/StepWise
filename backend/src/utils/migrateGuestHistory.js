const Explanation = require("../models/explanation.model");
const { redisClient } = require("../config/redis");

const migrateGuestHistory = async (guestSessionId, userId) => {
  if (!guestSessionId) return 0;

  const redisKey = `guest:${guestSessionId}`;
  const existing = await redisClient.get(redisKey);

  if (!existing) return 0;

  const guestHistory = JSON.parse(existing);

  const documentsToInsert = guestHistory.map((item) => ({
    problem: item.problem,
    pattern: item.pattern,
    difficulty: item.difficulty,
    sections: item.sections,
    trace: item.trace,
    traceNote: item.traceNote,
    pitfalls: item.pitfalls,
    complexity: item.complexity,
    userId,
  }));

  await Explanation.insertMany(documentsToInsert);
  await redisClient.del(redisKey);

  return documentsToInsert.length;
};

module.exports = migrateGuestHistory;