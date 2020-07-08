# API Reference
This file contains documentation for each new function in CraftOS-PC.

## `config`
Changes ComputerCraft configuration variables in ComputerCraft.cfg.
### Functions
* *any* get(*string* name): Returns the value of a configuration variable.
  * name: The name of the variable
  * Returns: The value of the variable
* *void* set(*string* name, *any* value): Sets the value of a configuration variable.
  * name: The name of the variable
  * value: The new value of the variable
* *table* list(): Returns a list of all configuration variable names.
* *number* getType(*string* name): Returns the type of a variable.
  * name: The name of the variable
  * Returns: 0 for boolean, 1 for string, 2 for number, 3 for table

## `debugger` peripheral
Functions for interacting with the debugger from the target computer.
### Methods
* *nil* stop(): Stops the computer and opens the debugger prompt.
* *number* setBreakpoint(*string* file, *number* line): Sets a breakpoint in a file at a line number.
  * file: The full file path to the script to stop on
  * line: The line number to set the breakpoint at
  * Returns: The ID of the new breakpoint
* *nil* print(*any* value): Prints a value on the debugger's console window.
  * value: The value to print

## `drive` peripheral
Floppy drive emulator that supports loading mounts (see mounter API), floppy disks (by ID), and audio files.
See [disk API](https://computercraft.info/wiki/Disk_(API)) for other functions.
### Methods
* *nil* insertDisk(*string/number* path): Replaces the loaded disk with the specified resource.
  * path: Either a disk ID or path to load
	* If number: Mounts the floppy disk (`<save dir>/computer/disk/<id>`) to /disk[n]
	* If path to directory: Mounts the real path specified to /disk[n]
	* If path to file: Loads the file as an audio disc (use `disk.playAudio` or the "dj" command)

## `http`
HTTP server extension in the `http` API.
### Functions
* *nil* addListener(*number* port): Adds a listener on a port.
  * port: The port to listen on
* *nil* removeListener(*number* port): Frees a port to be listened on again later.
  * port: The port to stop listening on
* *nil* listen(*number* port, *function* callback): Starts a server on a port and calls a function when a request is made.
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
* http_request: Sent when an HTTP request is made.
  * *number*: The port the request was made on
  * *table*: The request table
  * *table*: The response table
* server_stop: Send this inside an `http.listen()` callback to stop the server

## `mounter`
Mounts and unmounts real directories.
### Functions
* *boolean* mount(*string* name, *string* path\[, *boolean* readOnly\]): Mounts a real directory to a ComputerCraft directory.
  * name: The local directory to mount to
  * path: The absolute directory to mount from
  * readOnly: Whether the mount should be read-only. The default value and whether this argument is available depend on the value of the `mount_mode` config option.
  * Returns: Whether the mount operation succeeded
* *boolean* unmount(*string* name): Unmounts a previously mounted directory.
  * name: The local directory to unmount
  * Returns: Whether the unmount operation succeeded
* *table* list(): Returns a key-value table of all current mounts on the system. Each value is a list of directories in a multi-mount (if not using multi-mounts, then only one value is in that list).
* *boolean* isReadOnly(*string* name): Returns whether a mount was mounted read-only.
  * name: The local directory of the mount
  * Returns: Whether the mount is read-only

## `os`
Additional functions in the OS API.
### Functions
* *string* about(): Returns an about message with the version, license, and special thanks.

## `periphemu`
Creates and removes peripherals from the registry.
### Functions
* *boolean* create(*string* side, *string* type\[, *string* path\]): Creates a new peripheral.
  * side: The side of the new peripheral
  * type: One of `computer`, `drive`, `modem`, `monitor`, `printer`
  * path: If creating a printer, the local path to the output file
  * Returns: `true` on success, `false` on failure (already exists)
* *boolean* remove(*string* side): Removes a peripheral.
  * side: The side to remove
  * Returns: `true` on success, `false` on failure (already removed)
* *table* names(): Returns a list of available peripheral types.

## `term`
Graphics mode extension in the `term` API.
### Functions
* *nil* setGraphicsMode(*number/boolean* mode): Sets whether the terminal is in pixel-graphics mode
  * mode: `2` for 256-color graphics mode, `true` or `1` for 16-color graphics mode, `false` or `0` for text mode
* *boolean* getGraphicsMode(): Returns the current graphics mode setting (false for text mode, number for graphics mode).
* *nil* setPixel(*number* x, *number* y, *color* color): Sets a pixel at a location.
  * x: The X coordinate of the pixel
  * y: The Y coordinate of the pixel
  * color: The color of the pixel
    * In mode 1, this should be a color in `colors`
    * In mode 2, this should be an index from 0-255
* *color* getPixel(*number* x, *number* y): Returns the color of a pixel at a location.
  * x: The X coordinate of the pixel
  * y: The Y coordinate of the pixel
  * Returns: The color of the pixel
* *nil* drawPixels(*number* startX, *number* startY, *table* pixels): Draws multiple pixels to the screen at once.
  * startX: The starting X coordinate of the bitmap
  * startY: The starting Y coordinate of the bitmap
  * pixels: A list of lines to draw on the screen. Each line may be a table with color values to draw (as in `setPixel`), or a string with each character mapping to one pixel (the colors will be 0-255 even in 16-color mode).
* *nil* setPaletteColor(*number* color, *number* r[, *number* g, *number* b]): Sets the RGB values for a color. (Override)
  * color: The color to change
    * In mode 1, this should be a color in `colors`
    * In mode 2, this should be an index from 0-255
  * r: Either the red value from 0.0 to 1.0, or an RGB hex value
  * g: The green value from 0.0 to 1.0
  * b: The blue value from 0.0 to 1.0
* *number*, *number*, *number* getPaletteColor(*number* color): Returns the RGB values for a color. (Override)
  * color: The color to change
    * In mode 1, this should be a color in `colors`
    * In mode 2, this should be an index from 0-255
  * Returns: The RGB values for the color, each from 0.0 to 1.0
* *nil* screenshot(): Takes a screenshot. This function is rate-limited to prevent spam.
* *nil* showMouse(*boolean* mouse): Toggles whether to show the mouse cursor over the window.