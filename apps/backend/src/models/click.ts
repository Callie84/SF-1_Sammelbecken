import { Schema, model } from 'mongoose';

const clickSchema = new Schema({
  partner: String,
  slug: String,                // z. B. Strain-Name
  ts: { type: Date, default: Date.now },
  uaHash: { type: String },    // SHA-256(User-Agent) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ kein PII
  ref: { type: String }        // Referer Domain, optional
});

export default model('Click', clickSchema);