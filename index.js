'use strict';

const express = require('express')
const app = express()
const { initTracer } = require('./tracing.js');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const request = require('request-promise');

const tracer = initTracer('nodejs-service');

const port = 8090;

function makeRequest(rootSpan) {
    const span = tracer.startSpan("GET to /get-employees", {childOf: rootSpan.context()});
    span.log({ message: 'Making call to get employee' });

    const url = `http://jaeger-tracing-java-service:8080/api/tutorial/1.0/employees-error/7`;
    const method = 'GET';
    const headers = {};
    span.setTag(Tags.HTTP_URL, url);
    span.setTag(Tags.HTTP_METHOD, method);
    span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
    tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
    request({ url, method, headers })
        .then( data => {
            span.setTag(Tags.HTTP_STATUS_CODE, 200);
            span.log({ message: 'Call successful' });
            span.finish();
            return data;
        }, err => {
            span.setTag(Tags.ERROR, true)
            span.setTag(Tags.HTTP_STATUS_CODE, err.statusCode || 500);
            span.log({ message: 'Error calling server to get employee' });
            span.finish();
        });
};

app.get('/get-employees', (req, res)  => {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
    const rootSpan = tracer.startSpan('"GET to /get-employees', {
        childOf: parentSpanContext,
        tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
    });
    rootSpan.log({ message: 'Endpoint request receieved' });

    makeRequest(rootSpan);

    rootSpan.finish()
    res.send(`Hello, Chris`);
})

app.listen(port, () => {
    console.log('Formatter app listening on port ' + port);
})