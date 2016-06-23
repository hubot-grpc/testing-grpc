var grpc = require('grpc');
var Long = require("long");

var testing_proto = grpc.load('/api/main.proto');

function emptyResponse(call, callback) {
  callback(null, {});
}

function simpleResponse(call, callback) {
  callback(null, { text: 'test text' });
}

function complexResponse(call, callback) {
  callback(null, { first: { text: 'first' }, second: { text: 'second' } });
}

function simpleRequest(call, callback) {
  callback(null, {});
}

function complexRequest(call, callback) {
  callback(null, {});
}

function simpleRequestComplexResponse(call, callback) {
  callback(null, { first: call.request, second: call.request });
}

function streamingRequest(call, callback) {
  let latest = {};
  call.on('data', data => {
    latest = data;
  });
  call.on('end', () => {
    callback(null, latest);
  });
}

function streamingResponse(call) {
  for (let i = 0; i < 50; i++) {
    call.write({text: "test text " + i});
  }
}

function bidirectionalStreaming(call) {
  call.on('data', data => {
    call.write(data);
  });
}

function enumRequest(call, callback) {
  console.log(call.request);
  callback(null, { text: JSON.stringify(call.request) });
}

function enumResponse(call, callback) {
  callback(null, {value: 2});
}

function anyRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function anyResponse(call, callback) {
  let possibleResponses = [
    {thing: 42},
    {thing: "some text"},
    {thing: ["some", "string", "values"]},
    {thing: {someNumber: 42, someString: "some text"}}
  ];
  let responseIndex = Math.floor(Math.random() * possibleResponses.length);
  callback(null, possibleResponses[responseIndex]);
}

function oneOfRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function oneOfResponse(call, callback) {
  let possibleResponses = [
    {text: "some info text"},
    {object: {text: "some info text inside an object"}}
  ];
  let responseIndex = Math.floor(Math.random() * possibleResponses.length);
  callback(null, possibleResponses[responseIndex]);
}

function arrayRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function arrayResponse(call, callback) {
  callback(null, {items: ["item1", "item2", "item3"]});
}

function mapRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function mapResponse(call, callback) {
  callback(null, {
    first: {text: "item1"},
    second: {text: "item2"},
    third: {text: "item3"}
  });
}

function scalarValuesRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function scalarValuesResponse(call, callback) {
  callback(null, {
    doubleValue: 2147483648.5,
    floatValue: 123.456,
    int32Value: 123,
    int64Value: new Long(0xFFFFFFFF, 0x7FFFFFFF),
    uint32Value: 123,
    uint64Value: new Long(0xFFFFFFFF, 0x7FFFFFFF),
    sint32Value: 123,
    sint64Value: new Long(0xFFFFFFFF, 0x7FFFFFFF),
    fixed32Value: 123,
    fixed64Value: new Long(0xFFFFFFFF, 0x7FFFFFFF),
    sfixed32Value: 123,
    sfixed64Value: new Long(0xFFFFFFFF, 0x7FFFFFFF),
    boolValue: true,
    stringValue: "some text",
    bytesValue: [42, 0, 255]
  });
}

function importedRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function importedResponse(call, callback) {
  callback(null, {foo: "bar"});
}

function absolutelyReferencedRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function absolutelyReferencedResponse(call, callback) {
  callback(null, {title: "foo", content: "bar"});
}

function requestReferencedFromRoot(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function responseReferencedFromRoot(call, callback) {
  callback(null, {title: "foo", content: "bar"});
}

var server = new grpc.Server();
server.addProtoService(testing_proto.testing.test.service, {
  emptyResponse: emptyResponse,
  simpleResponse: simpleResponse,
  complexResponse: complexResponse,
  simpleRequest: simpleRequest,
  complexRequest: complexRequest,
  simpleRequestComplexResponse: simpleRequestComplexResponse,

  streamingRequest: streamingRequest,
  streamingResponse: streamingResponse,
  bidirectionalStreaming: bidirectionalStreaming,

  enumRequest: enumRequest,
  enumResponse: enumResponse,

  anyRequest: anyRequest,
  anyResponse: anyResponse,

  oneOfRequest: oneOfRequest,
  oneOfResponse: oneOfResponse,

  arrayRequest: arrayRequest,
  arrayResponse: arrayResponse,

  mapRequest: mapRequest,
  mapResponse: mapResponse,

  scalarValuesRequest: scalarValuesRequest,
  scalarValuesResponse: scalarValuesResponse,

  importedRequest: importedRequest,
  importedResponse: importedResponse,
  absolutelyReferencedRequest: absolutelyReferencedRequest,
  absolutelyReferencedResponse: absolutelyReferencedResponse,
  requestReferencedFromRoot: requestReferencedFromRoot,
  responseReferencedFromRoot: responseReferencedFromRoot
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
