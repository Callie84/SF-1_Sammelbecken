import mongoose from 'mongoose';
import Affiliate from '../src/models/affiliate.js';

const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

await Affiliate.deleteMany({});
await Affiliate.insertMany([
  {
    partner: 'zamnesia',
    baseUrl: 'https://www.zamnesia.com/search',
    paramSlug: 'query',
    utm: { source: 'sf1', medium: 'affiliate', campaign: 'zamnesia' },
    active: true
  },
  {
    partner: 'rqs',
    baseUrl: 'https://www.royalqueenseeds.de/catalogsearch/result/',
    paramSlug: 'q',
    utm: { source: 'sf1', medium: 'affiliate', campaign: 'rqs' },
    active: true
  }
]);

console.log('affiliate configs seeded');
process.exit(0);