import client from 'prom-client';


export const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });


export const jobCount = new client.Gauge({ name: 'sf1_scraper_jobs', help: 'Jobs per state', labelNames: ['state'] });
export const jobDuration = new client.Histogram({ name: 'sf1_scraper_job_duration_ms', help: 'Job duration', buckets: [50,100,250,500,1000,2000,5000,10000] });
export const jobRetries = new client.Counter({ name: 'sf1_scraper_job_retries', help: 'Retry count' });
export const jobFailures = new client.Counter({ name: 'sf1_scraper_job_failures', help: 'Failures' });


registry.registerMetric(jobCount);
registry.registerMetric(jobDuration);
registry.registerMetric(jobRetries);
registry.registerMetric(jobFailures);