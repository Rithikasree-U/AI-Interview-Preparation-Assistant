import Interview from '../models/Interview.js';
import { computeSkillBreakdown } from '../services/interviewService.js';

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's completed interviews
    const completedInterviews = await Interview.find({ userId, completed: true }).sort({ completedAt: 1 });

    const totalInterviews = completedInterviews.length;

    let averageScore = 0;
    let questionsPracticed = 0;
    let currentImprovement = 0;

    if (totalInterviews > 0) {
      const sumScores = completedInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0);
      averageScore = Math.round(sumScores / totalInterviews);

      completedInterviews.forEach((inv) => {
        if (inv.answers && Array.isArray(inv.answers)) {
          questionsPracticed += inv.answers.length;
        }
      });

      if (totalInterviews >= 2) {
        const firstScore = completedInterviews[0].score || 0;
        const lastScore = completedInterviews[totalInterviews - 1].score || 0;
        currentImprovement = lastScore - firstScore;
      }
    }

    // Recent 5 completed interviews (most recent first)
    const recentInterviews = [...completedInterviews].reverse().slice(0, 5);

    // Compute skills from real database answers
    const skillAnalysis = computeSkillBreakdown(completedInterviews);

    return res.json({
      interviewsCompleted: totalInterviews,
      averageScore,
      questionsPracticed,
      currentImprovement,
      recentInterviews,
      skillAnalysis,
    });
  } catch (error) {
    console.error('[Dashboard Stats Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch dashboard statistics' });
  }
};

// @desc    Get progress and historical trends for logged-in user
// @route   GET /api/dashboard/progress
// @access  Private
export const getProgressData = async (req, res) => {
  try {
    const userId = req.user._id;
    const completedInterviews = await Interview.find({ userId, completed: true }).sort({ completedAt: 1 });

    const totalCount = completedInterviews.length;

    const scoreHistory = completedInterviews.map((inv, idx) => ({
      interviewIndex: idx + 1,
      date: inv.completedAt ? new Date(inv.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Interview #${idx + 1}`,
      score: inv.score || 0,
      role: inv.role,
      type: inv.interviewType,
    }));

    let improvementPercentage = 0;
    let insightMessage = 'Complete a few interviews to start tracking your progress over time.';

    if (totalCount >= 2) {
      const firstScore = completedInterviews[0].score || 0;
      const latestScore = completedInterviews[totalCount - 1].score || 0;
      improvementPercentage = latestScore - firstScore;

      if (improvementPercentage > 0) {
        insightMessage = `Your average score improved by ${improvementPercentage}% from your initial session to your latest interview.`;
      } else if (improvementPercentage < 0) {
        insightMessage = `Your latest interview score changed by ${improvementPercentage}% compared to your first session. Focus on key weak areas.`;
      } else {
        insightMessage = `Your score has remained steady at ${latestScore}%. Aim for higher accuracy in your next session.`;
      }
    } else if (totalCount === 1) {
      insightMessage = `You have completed 1 interview with a score of ${completedInterviews[0].score}%. Complete one more to unlock progress comparison!`;
    }

    const skillBreakdown = computeSkillBreakdown(completedInterviews);

    return res.json({
      totalCount,
      scoreHistory,
      improvementPercentage,
      insightMessage,
      skillBreakdown,
    });
  } catch (error) {
    console.error('[Dashboard Progress Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch progress metrics' });
  }
};
