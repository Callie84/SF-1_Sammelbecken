import { Schema, model } from 'mongoose';

const affiliateSchema = new Schema({
  partner: { type: String, unique: true, index: true },
  baseUrl: { type: String, required: true },           // z. B. https://www.zamnesia.com/search?query=
  paramSlug: { type: String, default: 'query' },       // welcher Query-Parameter den Slug bekommt
  utm: {
    source: { type: String, default: 'sf1' },
    medium: { type: String, default: 'affiliate' },
    campaign: { type: String, default: '' }
  },
  active: { type: Boolean, default: true }
});

export default model('Affiliate', affiliateSchema);