const AffiliateLink = require('../models/AffiliateLink');
const AffiliateClick = require('../models/AffiliateClick');

async function getAffiliateLink(seedbank) {
  // find link by seedbank
  const link = await AffiliateLink.findOne({ seedbank });
  if (!link) throw new Error('Affiliate-Link nicht gefunden');
  return link;
}

async function recordClick(linkId, userId, ip, userAgent) {
  const click = new AffiliateClick({ affiliateLinkId: linkId, userId, ip, userAgent });
  await click.save();
}
module.exports = { getAffiliateLink, recordClick };