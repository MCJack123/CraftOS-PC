# HTTP Server
CraftOS-PC adds support for running HTTP listeners on a port. Once a listener is added, an event will be queued each time a request is made to the server.

## Simple interface
The `http.listen(port, callback)` function allows listening on a port synchronously without requiring an extra event loop. It takes the port to listen on and a callback as arguments. When a request is made, the callback is called with two tables: a request input handle, and a response output handle. These handles function similar to read and write file handles, with the following extra methods available:
* `request.getURL()`: Returns the URI endpoint of the request
* `request.getMethod()`: Returns the HTTP method of the request
* `request.getRequestHeaders()`: Returns a table of headers sent by the client
* `response.setStatusCode(code)`: Sets the HTTP response code to send
* `response.setResponseHeader(key, value)`: Sets a header key/value to send

The response will not be sent until `response.close()` is called, so make sure to always call it before returning from the callback. To stop the listener, return true from the callback function or queue a `server_stop` event. The listener will automatically be closed and `http.listen` will return.

## Adding & removing listeners
The `http.addListener(port)` function activates a listener on the specified port. Once the listener is added, a background thread will listen for HTTP requests on the port. When a request is made, the server will queue an event named `http_request` with the port number, a request handle, and a response handle. Listeners can be removed with `http.removeListener(port)`, which will stop the server thread and requests will no longer be serviced.

## WebSocket servers
In addition to normal HTTP servers, CraftOS-PC can also serve WebSocket connections. To do this, call `http.websocket` with the port you want to listen on. This will wait for a connection from a WebSocket client, and once connected a handle will be returned with the same contents as a normal WebSocket handle.
