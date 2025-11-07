"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobFailures = exports.jobRetries = exports.jobDuration = exports.jobCount = exports.registry = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
exports.registry = new prom_client_1.default.Registry();
prom_client_1.default.collectDefaultMetrics({ register: exports.registry });
exports.jobCount = new prom_client_1.default.Gauge({ name: 'sf1_scraper_jobs', help: 'Jobs per state', labelNames: ['state'] });
exports.jobDuration = new prom_client_1.default.Histogram({ name: 'sf1_scraper_job_duration_ms', help: 'Job duration', buckets: [50, 100, 250, 500, 1000, 2000, 5000, 10000] });
exports.jobRetries = new prom_client_1.default.Counter({ name: 'sf1_scraper_job_retries', help: 'Retry count' });
exports.jobFailures = new prom_client_1.default.Counter({ name: 'sf1_scraper_job_failures', help: 'Failures' });
exports.registry.registerMetric(exports.jobCount);
exports.registry.registerMetric(exports.jobDuration);
exports.registry.registerMetric(exports.jobRetries);
exports.registry.registerMetric(exports.jobFailures);
