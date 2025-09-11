const Subscription = require('../models/Subscription');
const User = require('../models/User');
const GrowCycle = require('../models/GrowCycle');

// Anzahl User pro Plan
async function getPlanStats() {
  const freeCount = await Subscription.countDocuments({ plan: 'free' });
  const premiumCount = await Subscription.countDocuments({ plan: 'premium' });
  return { freeCount, premiumCount };
}

// Aktive User und neue Registrierungen
async function getUserStats() {
  const totalUsers = await User.countDocuments();
  const newLastMonth = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30*24*3600*1000) }
  });
  return { totalUsers, newLastMonth };
}

// GrowCycle-Nutzungsstatistik
async function getGrowUsage() {
  const totalCycles = await GrowCycle.countDocuments();
  const avgCyclesPerUser = totalCycles / (await User.countDocuments());
  return { totalCycles, avgCyclesPerUser: Number(avgCyclesPerUser.toFixed(2)) };
}

module.exports = { getPlanStats, getUserStats, getGrowUsage };