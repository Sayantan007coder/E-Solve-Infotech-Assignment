import Case from '../models/caseModel.js';
import Joi from 'joi';
import csv from 'csvtojson';

const caseSchema = Joi.object({
  case_id: Joi.string().required(),
  bank_code: Joi.string().required(),
  borrower_name: Joi.string().required(),
  loan_amount: Joi.number().required(),
  due_amount: Joi.number().required(),
  days_past_due: Joi.number().required(),
  priority: Joi.string().required(),
  region: Joi.string().required(),
});

export const uploadCases = async (req, res, next) => {
  try {
    let cases = [];
    if (req.is('application/json')) {
      cases = Array.isArray(req.body) ? req.body : [req.body];
    } else if (req.is('text/csv')) {
      cases = await csv().fromString(req.body);
    } else {
      return res.status(400).json({ message: 'Unsupported content type' });
    }

    const processedCases = [];
    for (const c of cases) {
      const { error, value } = caseSchema.validate(c);
      if (error) {
        return res.status(400).json({ message: `Validation error: ${error.message}` });
      }
      // Normalize data if needed here
      const existingCase = await Case.findOne({ case_id: value.case_id });
      if (existingCase) {
        // Update raw data
        existingCase.raw_data = c;
        await existingCase.save();
        processedCases.push(existingCase);
      } else {
        const newCase = new Case({ ...value, raw_data: c });
        await newCase.save();
        processedCases.push(newCase);
      }
    }

    res.status(201).json({ message: 'Cases uploaded successfully', cases: processedCases });
  } catch (error) {
    next(error);
  }
};

export const getAssignedCases = async (req, res, next) => {
  try {
    const { assigned_to } = req.query;
    if (!assigned_to) {
      return res.status(400).json({ message: 'assigned_to query parameter is required' });
    }
    const cases = await Case.find({ assigned_to }).populate('assigned_to', 'username role');
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

export const updateCaseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Resolved', 'Escalated'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const caseToUpdate = await Case.findById(id);
    if (!caseToUpdate) {
      return res.status(404).json({ message: 'Case not found' });
    }

    caseToUpdate.status = status;
    caseToUpdate.audit_log.push({ status, changedBy: req.user._id });
    await caseToUpdate.save();

    res.json({ message: 'Case status updated', case: caseToUpdate });
  } catch (error) {
    next(error);
  }
};