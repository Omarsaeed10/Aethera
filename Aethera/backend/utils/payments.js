const db = require('../db');

const PLANS = {
  free: { name: 'Free Student', dailyLimit: 20, priceUsd: 0 },
  pro: { name: 'Pro Scholar', dailyLimit: 1000, priceUsd: 4.99 },
  campus: { name: 'Campus Team', dailyLimit: 10000, priceUsd: 19.99 }
};

/**
 * Check if user has active quota remaining
 */
function checkUserQuota(userId, callback) {
  db.get('SELECT plan_type, status FROM subscriptions WHERE user_id = ?', [userId], (err, sub) => {
    const planKey = (sub && sub.status === 'active') ? sub.plan_type : 'free';
    const plan = PLANS[planKey] || PLANS.free;

    const todayStr = new Date().toISOString().split('T')[0];

    db.get('SELECT COUNT(*) as count FROM api_usage_analytics WHERE user_id = ? AND date(created_at) = ?', [userId, todayStr], (usageErr, row) => {
      const usedToday = (row && row.count) || 0;
      const remaining = Math.max(0, plan.dailyLimit - usedToday);
      const isAllowed = usedToday < plan.dailyLimit;

      callback({
        isAllowed,
        planName: plan.name,
        dailyLimit: plan.dailyLimit,
        usedToday,
        remaining
      });
    });
  });
}

/**
 * Create Mock Checkout Session (or Stripe Checkout)
 */
function createCheckoutSession(userId, planType) {
  const plan = PLANS[planType] || PLANS.pro;
  const sessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
  
  return {
    sessionId,
    url: `${process.env.APP_URL || 'http://localhost:34567'}/?checkout_success=true&session_id=${sessionId}&plan=${planType}`,
    plan: plan.name,
    amountUsd: plan.priceUsd
  };
}

/**
 * Activate or update user subscription
 */
function activateSubscription(userId, planType, callback) {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const periodEndStr = nextMonth.toISOString();

  db.run(`
    INSERT INTO subscriptions (user_id, plan_type, status, current_period_end)
    VALUES (?, ?, 'active', ?)
    ON CONFLICT(user_id) DO UPDATE SET
      plan_type = excluded.plan_type,
      status = 'active',
      current_period_end = excluded.current_period_end
  `, [userId, planType, periodEndStr], function(err) {
    if (callback) callback(err);
  });
}

module.exports = {
  PLANS,
  checkUserQuota,
  createCheckoutSession,
  activateSubscription
};
