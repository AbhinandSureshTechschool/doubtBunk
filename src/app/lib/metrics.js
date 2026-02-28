import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

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

  const registerCounter = new client.Counter({
    name: "register_attempts_total",
    help: "Total register attempts",
  });

  const doubtCounter = new client.Counter({
     name: "doubts_add_attempts_total",
     help: "Total doubt add attempts"
  });

  const answerCounter = new client.Counter({
    name: "answers_add_attempts_total",
    help: "Total answers add attemtps"
  })

  register.registerMetric(httpRequestCounter);
  register.registerMetric(httpRequestDuration);
  register.registerMetric(errorCounter);
  register.registerMetric(loginCounter);
  register.registerMetric(registerCounter);
  register.registerMetric(doubtCounter);
  register.registerMetric(answerCounter);

  global.metrics = {
    register,
    httpRequestCounter,
    httpRequestDuration,
    errorCounter,
    loginCounter,
    registerCounter,
    doubtCounter,
    answerCounter,
  };
}

export default global.metrics;