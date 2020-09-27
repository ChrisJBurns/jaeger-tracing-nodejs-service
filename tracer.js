const { LogLevel } = require("@opentelemetry/core");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const serviceName = process.env.SERVICE_NAME || "nodejs-service";
const jaegerHost = process.env.JAEGER_HOST || 'localhost';

const provider = new NodeTracerProvider({
    plugins: {
        http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
            ignoreIncomingPaths: [
            '/',
            '/health'
            ]
        },
    },
    logLevel: LogLevel.ERROR
});

provider.register();

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
        serviceName: serviceName,
        host: jaegerHost,
        port: 6832
    })
  )
);

console.log("Tracing initialized");
