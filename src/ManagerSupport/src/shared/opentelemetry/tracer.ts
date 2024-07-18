import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const tracerSetup = async (otelCollectorUrl: string) => {

  // Configure the SDK to export telemetry data to the console
  // Enable all auto-instrumentations from the meta package
  const traceExporterOptions = {
    url: otelCollectorUrl + '/v1/traces',
  };

  const metricsExporterOptions = {
    url: otelCollectorUrl + '/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
    //headers: {}, // an optional object containing custom headers to be sent with each request
    //concurrencyLimit: 1, // an optional limit on pending requests
  };

  const traceExporter = new OTLPTraceExporter(traceExporterOptions);
  const metricExporter = new OTLPMetricExporter(metricsExporterOptions);

  const sdk = new NodeSDK({
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      // new NestInstrumentation(),
      // new HttpInstrumentation(),
      // new ExpressInstrumentation(),
      new RuntimeNodeInstrumentation({
        eventLoopUtilizationMeasurementInterval: 5000,
      })
    ],
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'ManagerSupportWebApi',
      'service.version': '1.0.0',
    }),
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry

  console.log('Tracing starting...');
  await sdk.start();
  console.log('Tracing started...');

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });

};