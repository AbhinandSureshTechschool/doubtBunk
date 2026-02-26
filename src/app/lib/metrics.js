import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

// Prevent duplicate metrics in dev / hot reload
if (!global.metrics) {
  const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total API requests",
    labelNames: ["method", "route", "status"],
  });

  const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "API response time",
    labelNames: ["method", "route"],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  });

  const errorCounter = new client.Counter({
    name: "http_errors_total",
    help: "Total 500 errors",
  });

  const loginCounter = new client.Counter({
    name: "login_attempts_total",
    help: "Total login attempts",
  });

  register.registerMetric(httpRequestCounter);
  register.registerMetric(httpRequestDuration);
  register.registerMetric(errorCounter);
  register.registerMetric(loginCounter);

  global.metrics = {
    register,
    httpRequestCounter,
    httpRequestDuration,
    errorCounter,
    loginCounter,
  };
}

export default global.metrics;