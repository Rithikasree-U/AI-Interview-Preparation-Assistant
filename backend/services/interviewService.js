/**
 * Compute overall metrics and score from array of evaluated answers
 */
export const calculateInterviewScore = (answers) => {
  if (!answers || answers.length === 0) {
    return {
      overallScore: 0,
      metrics: {
        technicalKnowledge: 0,
        communication: 0,
        relevance: 0,
        accuracy: 0,
        problemSolving: 0,
      },
    };
  }

  let totalScore = 0;
  let totalTech = 0;
  let totalComm = 0;
  let totalRel = 0;
  let totalCorr = 0;

  answers.forEach((ans) => {
    totalScore += ans.score || 0;
    totalTech += ans.technicalKnowledge || ans.score || 0;
    totalComm += ans.communication || ans.score || 0;
    totalRel += ans.relevance || ans.score || 0;
    totalCorr += ans.correctness || ans.score || 0;
  });

  const count = answers.length;
  // Convert 0-10 scale to 0-100 percentage scale
  const overallScore = Math.round((totalScore / (count * 10)) * 100);

  const metrics = {
    technicalKnowledge: Math.round((totalTech / (count * 10)) * 100),
    communication: Math.round((totalComm / (count * 10)) * 100),
    relevance: Math.round((totalRel / (count * 10)) * 100),
    accuracy: Math.round((totalCorr / (count * 10)) * 100),
    problemSolving: Math.round(((totalTech + totalCorr) / (count * 20)) * 100),
  };

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    metrics,
  };
};

/**
 * Compute skill percentage breakdown across user's completed interviews
 */
export const computeSkillBreakdown = (completedInterviews) => {
  const categoryScores = {};
  const categoryCounts = {};

  const defaultCategories = ['Java', 'Python', 'JavaScript', 'Data Structures', 'DBMS', 'OOP', 'Communication', 'Problem Solving'];

  // Initialize defaults
  defaultCategories.forEach((cat) => {
    categoryScores[cat] = 0;
    categoryCounts[cat] = 0;
  });

  completedInterviews.forEach((interview) => {
    if (interview.answers && Array.isArray(interview.answers)) {
      interview.answers.forEach((ans) => {
        const cat = ans.category || 'General';
        const score = ans.score || 0;

        if (!categoryScores[cat]) {
          categoryScores[cat] = 0;
          categoryCounts[cat] = 0;
        }

        categoryScores[cat] += score;
        categoryCounts[cat] += 1;
      });
    }
  });

  const skillAnalysis = [];

  // Build array of skills
  Object.keys(categoryScores).forEach((cat) => {
    const count = categoryCounts[cat];
    const percentage = count > 0 ? Math.round((categoryScores[cat] / (count * 10)) * 100) : 0;
    skillAnalysis.push({
      category: cat,
      percentage: Math.min(100, Math.max(0, percentage)),
      practicedCount: count,
    });
  });

  return skillAnalysis;
};
