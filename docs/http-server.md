# HTTP & WebSocket Server
CraftOS-PC adds support for running HTTP and WebSocket listeners on a port. Once a listener is added, an event will be queued each time a request is made to the server.

## Simple interface
The `http.listen(port, callback)` function allows listening on a port synchronously without requiring an extra event loop. It takes the port to listen on and a callback as arguments. When a request is made, the callback is called with two tables: a request input handle, and a response output handle. These handles function similar to read and write file handles, with the following extra methods available:
* `request.getURL()`: Returns the URI endpoint of the request
* `request.getMethod()`: Returns the HTTP method of the request
* `request.getRequestHeaders()`: Returns a table of headers sent by the client
* `response.setStatusCode(code)`: Sets the HTTP response code to send
* `response.setResponseHeader(key, value)`: Sets a header key/value to send

The response will not be sent until `response.close()` is called, so make sure to always call it before returning from the callback. To stop the listener, return true from the callback function or queue a `server_stop` event. The listener will automatically be closed and `http.listen` will return.

### Functions
* *nil* `http.listen`(*number* port, *function* callback): Starts a server on a port and calls a function when a request is made.
  * port: The port to listen on
  * callback(*table* req, *table* res): The callback to call
    * req: A read file handle to the request data, with the following extra functions:
      * getURL(): Returns the URI endpoint of the request
      * getMethod(): Returns the HTTP method of the request
      * getRequestHeaders(): Returns a table of headers sent by the client
    * res: A write file handle to the response data, with the following extra functions:
      * setStatusCode(*number* code): Sets the HTTP response code to send
      * setResponseHeader(*string* key, *string* value): Sets a header value to send
    * **ALWAYS** call `res.close()` before returning from the callback 

### Events
* `http_request`: Sent when an HTTP request is made.
  * *number*: The port the request was made on
  * *table*: The request table
  * *table*: The response table
* `server_stop`: Send this inside an `http.listen()` callback to stop the server

## Adding & removing listeners
The `http.addListener(port)` function activates a listener on the specified port. Once the listener is added, a background thread will listen for HTTP requests on the port. When a request is made, the server will queue an event named `http_request` with the port number, a request handle, and a response handle. Listeners can be removed with `http.removeListener(port)`, which will stop the server thread and requests will no longer be serviced.

### Functions
* *nil* `http.addListener`(*number* port): Adds a listener on a port.
  * port: The port to listen on
* *nil* `http.removeListener`(*number* port): Frees a port to be listened on again later.
  * port: The port to stop listening on

## WebSocket servers
In addition to normal HTTP servers, CraftOS-PC can also serve WebSocket connections. To do this, call `http.websocketServer` with the port you want to listen on. This will return a new handle for the server. Use the `.listen()` method on it to wait for a new connection, and once connected, a handle will be returned with the same methods as a normal WebSocket handle. Multiple clients can connect to the server, and `.listen()` can be called multiple times to get each client. Call `.close()` on the server handle to close the server.

Client handles for a WebSocket server use a different set of events, prefixed with `websocket_server_` instead of `websocket_`. Instead of using the URL to identify each client, a client ID field is used. This is an opaque value that's given in the handle's `.clientID` field. Use this value if you need to listen to WebSocket events directly.

### Functions
* *table|nil, string* `http.websocketServer`(*number* port): Starts a WebSocket server on the specified port.
  * port: The port to listen on.
  * Returns: A WebSocket server handle, with `listen()` and `close()` methods.

### Events
* `websocket_server_connect`: Sent when a WebSocket client connects to a server.
  * *number* port: The port that was connected to
  * *table* handle: A WebSocket handle for the connection, with a `clientID` member
* `websocket_server_message`: Sent when a client sends a message to a server.
  * *userdata* clientID: The client ID that sent the message
  * *string* message: The message contents
  * *boolean* binary: Whether the message is a binary message
* `websocket_server_closed`: Sent when a client closes a connection.
  * *userdata* clientID: The client ID that closed
  * *string|nil* message: An optional message for why the connection was closed
  * *number|nil* code: An optional code for why the connection was closed
