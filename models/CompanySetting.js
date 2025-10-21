
import mongoose from 'mongoose';
import { encrypt } from '@/lib/crypto';

const CompanySettingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
  },
  logoUrl: {
    type: String,
    trim: true,
  },
});

export default mongoose.models.CompanySetting || mongoose.model('CompanySetting', CompanySettingSchema);
