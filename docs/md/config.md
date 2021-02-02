# ComputerCraft Configuration
CraftOS-PC includes the same configuration options available in base ComputerCraft, plus some more to control the new features in CraftOS-PC. These options are global to all computers (except `isColor`).

## Variables
These are the config variables available as of CraftOS-PC v2.5.2. *Variables marked `global.json` only are not exported through the `config` API and must be edited manually.*
* `abortTimeout` [17000]: Maximum time to wait for a program to yield before forcibly terminating
* `checkUpdates` [true]: Whether to check for updates at program start
* `cliControlKeyMode` [0] (`global.json` only): Sets the way CLI mode reads control keys
  * 0: Control/Alt keys are available with Home/End, and original keys can be pressed in combination with Shift
  * 1: Opposite of mode 0; Control/Alt are available with Shift+Home/End
  * 2: Control/Alt keys can be pressed with Esc, C/A
  * 3: Control/Alt keys can be pressed with Ctrl-C/Ctrl-\\
  * 4: Disable Control/Alt key emulation
* `clockSpeed` [20]: Terminal refresh rate
* `computerName` [] (computer-local): Name of the computer (cannot be set with `config` API)
* `configReadOnly` [false]: Whether the configuration settings should not be able to be changed inside CraftOS (if `true`, must be disabled from `global.json`)
* `customCharScale` [] (`global.json` only): Set this to change the default character scale
* `customFontPath` [] (`global.json` only): Set this to specify a custom font in BMP format (`hdfont` will use the built-in HD font)
* `customFontScale` [] (`global.json` only): When using a custom font (besides `hdfont`), set this to specify the scale divisor for the font (1 = 12x18, 2 = 6x9 (default), 3 = 4x6)
* `debug_enable` [false]: Whether to enable the `debug` API
* `default_computer_settings` []: A string with some default settings to set in the `settings` API
* `defaultWidth`/`defaultHeight` [51/19]: The default size of new terminal windows
* `disable_lua51_features` [false]: Whether to disable some Lua 5.1-only features in the BIOS
* `extendMargins` [false]: Whether to extend colored margins to the edges of the screen, independent of standards mode
* ~~`http_blacklist` [local IPs] (`global.json` only): An array of IP addresses or hostnames to block; this takes priority over the whitelist~~
* `http_enable` [true]: Whether to enable the `http` API
* `http_max_download` [16777216]: The maximum size of an HTTP response to accept, in bytes
* `http_max_requests` [16]: The maximum number of open HTTP request handles to allow, in bytes
* `http_max_upload` [4194304]: The maximum size of an entire HTTP request, including POST data and headers, in bytes
* `http_max_websocket_message` [65535]: The maximum size of one WebSocket message, in bytes
* `http_max_websockets` [4]: The maximum number of open WebSocket connections to allow
* `http_proxy_server`/`http_proxy_port` []: Allows using a proxy for HTTP connections
* `http_timeout` [30000]: The amount of time to wait for an HTTP request/response before terminating, in milliseconds
* `http_websocket_enabled` [true]: Whether to enable WebSocket support in the `http` API
* ~~`http_whitelist` ["*"] (`global.json` only): An array of IP addresses or hostnames to allow; any not in the list will be blocked~~
* `ignoreHotkeys` [false]: Whether to ignore hotkeys such as F2, F3, F11
* `initialComputer` [0]: The computer to start when opening CraftOS-PC
* `isColor` [true] (computer-local): Whether the emulated computer is an Advanced Computer (color) or Standard Computer (no color)
* `maximumFilesOpen` [128]: Maximum number of files that can be open at once
* `maxRecordingLength` [15]: The maximum number of seconds that a recording will run until it auto-stops (note that longer time * higher framerate = longer write time = higher memory usage)
* `maxOpenPorts` [128]: The maximum number of ports (channels) that may be open on a single modem
* `monitorsUseMouseEvents` [false]: Whether monitors should send `mouse_*` events (v2.3.4 and below behavior)
* `mount_mode` [1]: Specifies security settings for mounting directories
  * `none` (0): Do not allow mounting directories
  * `ro strict` or `ro_strict` (1): Force all mounts to be read-only
  * `ro` (2): Mounts default to read-only if not explicitly specified
  * `rw` (3): Mounts default to read-write unless marked read-only (v2.1.2 and below behavior)
* ~~`mounter_blacklist` ["/"] (`global.json` only): Paths to disallow mounting from, overriding the whitelist if deeper than its entry~~
* ~~`mounter_no_ask` [] (`global.json` only): A list of paths to allow mounting without prompting, regardless of `showMountPrompt`~~
* ~~`mounter_whitelist` [Users directories] (`global.json` only): Paths to allow mounting from, overriding the blacklist if deeper than its entry~~
* `mouse_move_throttle` [-1]: The amount of throttling placed on the `mouse_move` event
  * Values \>0 will only send `mouse_move` events no less than that number of milliseconds apart
  * 0 will disable throttling; `mouse_move` events will always be sent (could cause lag)
  * Values \<0 will disable the `mouse_move` event entirely
* `preferredHardwareDriver` []: The preferred driver to use with the hardware renderer. Run CraftOS-PC from the console with `-r` to list the available drivers (after `tror`).
* `recordingFPS` [10]: The framerate of GIF recordings. This value should be a divisor of `clockSpeed`, as the actual framerate is determined by integer division of both values.
* `romReadOnly` [true] (`global.json` only): Whether the ROM is mounted as read-only (change this only if you know what you're doing!) - note that in v2.4 this is reset when launched for the first time after updating
* `showMountPrompt` [true] (`global.json` only): Whether to prompt the user when mounting a directory (change this only if you know what you're doing!)
* `snapToSize` [true]: Whether to automatically snap window size to the nearest character size, keeping margins normalized
* `standardsMode` [false]: Enables a few super-compatibility options, such as 50ms timing and colored margins
* `startFullscreen` [false] (computer-local): Whether to start the computer in fullscreen mode
* `useHardwareRenderer` [false]: Whether to use the GPU for hardware-accelerated rendering
* `useVsync` [false]: Whether to enable Vsync with the hardware renderer
* `vanilla` [false]: Whether to disable all CraftOS-PC-specific features

## Changing variables
Configuration variables can be changed using the "config" shell command, the `config` API, or by editing the JSON files manually.

### From the shell
The "config" program allows you to change configuration variables from the shell. It has three subcommands: "get", "set", and "list". The "get" command will print the current value of a variable, "set" will change the value of a variable, and "list" will list all of the variables and their values. For example, "config set http_enable false" will disable the `http` API and all programs that use the Internet.

### From Lua
The `config` API is the Lua interface to the configuration. `config.get(name)` will return the value of a variable, and `config.set(name, value)` will set the value of a variable. To list the variables available, `config.list()` returns a table with the names of each configuration variable available, and `config.getType(name)` returns the type a variable expects as a string.

### Manually
The configuration is stored at `config` in the [CraftOS-PC data directory](saves). This folder contains a file named `global.json` that stores the configuration global to all computers; as well as one JSON file for each computer ID that stores local configuration variables. These JSON files can be edited manually to set the variables, but note that the config will not be reloaded until CraftOS-PC is fully quit (all computers closed) and relaunched. In addition, be aware that CraftOS-PC saves the configuration files when it quits, so you should only edit the files when all instances of CraftOS-PC are closed.
