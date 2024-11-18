import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  reseller: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  logo?: string;
  domainSettings: {
    subdomain: string;
    customDomain?: string;
    customDomainVerified?: boolean;
    dnsSettings?: {
      aRecord: string;
      cnameRecord: string;
      verificationToken: string;
    };
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  settings: {
    defaultMarkup: number;
    minimumMarkup: number;
    maximumMarkup: number;
    autoFulfillment: boolean;
    lowBalanceAlert: number;
  };
  status: 'pending' | 'active' | 'suspended';
  analytics: {
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>({
  reseller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  description: String,
  logo: String,
  domainSettings: {
    subdomain: { 
      type: String, 
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true
    },
    customDomainVerified: {
      type: Boolean,
      default: false
    },
    dnsSettings: {
      aRecord: String,
      cnameRecord: String,
      verificationToken: String
    }
  },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#4f46e5' },
    backgroundColor: { type: String, default: '#000000' }
  },
  settings: {
    defaultMarkup: { type: Number, default: 20, min: 0 },
    minimumMarkup: { type: Number, default: 10, min: 0 },
    maximumMarkup: { type: Number, default: 50, min: 0 },
    autoFulfillment: { type: Boolean, default: true },
    lowBalanceAlert: { type: Number, default: 100, min: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  analytics: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
StoreSchema.index({ reseller: 1 });
StoreSchema.index({ 'domainSettings.subdomain': 1 }, { unique: true });
StoreSchema.index({ 'domainSettings.customDomain': 1 }, { sparse: true });
StoreSchema.index({ status: 1 });
StoreSchema.index({ createdAt: -1 });

export const Store = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);