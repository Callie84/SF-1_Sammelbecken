import client from 'prom-client';


export const metrics = {
http: new client.Counter({ name: 'sf1_scrape_http_total', help: 'HTTP status family', labelNames: ['seedbank','family'] }),
bans: new client.Counter({ name: 'sf1_scrape_bans_total', help: 'Ban events', labelNames: ['seedbank'] }),
errors: new client.Counter({ name: 'sf1_scrape_errors_total', help: 'Scraper errors', labelNames: ['seedbank'] }),
duration: new client.Histogram({ name: 'sf1_scrape_duration_seconds', help: 'Duration', labelNames: ['seedbank'] })
};