import Case from '../models/caseModel.js';

export const getSummary = async (req, res, next) => {
  try {
    const totalCasesByStatus = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Mock data for avg resolution time and total due recovered
    const avgResolutionTime = 5; // days
    const totalDueRecovered = 100000; // mock amount

    const caseCountPerTeam = {
      callCenter: await Case.countDocuments({ days_past_due: { $lte: 30 } }),
      fieldAgent: await Case.countDocuments({ days_past_due: { $gt: 30, $lte: 90 } }),
      legalTeam: await Case.countDocuments({ days_past_due: { $gt: 90 } }),
    };

    res.json({
      totalCasesByStatus,
      avgResolutionTime,
      caseCountPerTeam,
      totalDueRecovered,
    });
  } catch (error) {
    next(error);
  }
};