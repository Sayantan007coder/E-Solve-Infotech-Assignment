import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption.js';

const auditLogSchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const caseSchema = new mongoose.Schema({
  case_id: { type: String, required: true, unique: true },
  bank_code: { type: String, required: true },
  borrower_name: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt,
  },
  loan_amount: { type: Number, required: true },
  due_amount: { type: Number, required: true },
  days_past_due: { type: Number, required: true },
  priority: { type: String, required: true },
  region: { type: String, required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Escalated'],
    default: 'Pending',
  },
  audit_log: [auditLogSchema],
  raw_data: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);