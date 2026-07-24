import mongoose, { Schema, Document } from 'mongoose';

export interface IGymData extends Document {
  GYM_INFO: any;
  SERVICES: any[];
  MEMBERSHIP_PLANS: any[];
  TRAINERS: any[];
  GALLERY_ITEMS: any[];
  REVIEWS: any[];
  HERO: any;
  CONTACT_OPTIONS: any;
}

const GymDataSchema: Schema = new Schema({
  GYM_INFO: { type: Schema.Types.Mixed, default: {} },
  SERVICES: { type: [Schema.Types.Mixed], default: [] },
  MEMBERSHIP_PLANS: { type: [Schema.Types.Mixed], default: [] },
  TRAINERS: { type: [Schema.Types.Mixed], default: [] },
  GALLERY_ITEMS: { type: [Schema.Types.Mixed], default: [] },
  REVIEWS: { type: [Schema.Types.Mixed], default: [] },
  HERO: { type: Schema.Types.Mixed, default: {} },
  CONTACT_OPTIONS: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models.GymData || mongoose.model<IGymData>('GymData', GymDataSchema);
