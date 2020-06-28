const initJaegerTracer = require("jaeger-client").initTracer;

module.exports.initTracer = serviceName => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
      agentHost: 'jaeger-tracing'
    },
  };
  const options = {
    tags: {
      'nodejs-service': '1.0.0',
    },
    logger: {
      info(msg) {
        console.log('INFO', msg);
      },
      error(msg) {
        console.log('ERROR', msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};