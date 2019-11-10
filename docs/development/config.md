# ComputerCraft Configuration
CraftOS-PC includes the same configuration options available in base ComputerCraft, plus some more to control the new features in CraftOS-PC. These options are global to all computers (except `isColor`).

## Variables
These are the config variables available as of CraftOS-PC v2.2. *Variables marked `global.json` only are not exported through the `config` API and must be edited manually.*
* `abortTimeout` [17000]: Maximum time to wait for a program to yield before forcibly terminating
* `checkUpdates` [true]: Whether to check for updates at program start
* `clockSpeed` [20]: Terminal refresh rate
* `computerName` [] (computer-local): Name of the computer (cannot be set with `config` API)
* `configReadOnly` [false]: Whether the configuration settings should not be able to be changed inside CraftOS (if `true`, must be disabled from `global.json`)
* `customCharScale` [] (`global.json` only): Set this to change the default character scale
* `customFontPath` [] (`global.json` only): Set this to specify a custom font in BMP format (`hdfont` will use the built-in HD font)
* `customFontScale` [] (`global.json` only): When using a custom font (besides `hdfont`), set this to specify the scale divisor for the font (1 = 12x18, 2 = 6x9 (default), 3 = 4x6)
* `debug_enable` [false]: Whether to enable the `debug` API
* `default_computer_settings` []: A string with some default settings to set in the `settings` API
* `disable_lua51_features` [false]: Whether to disable some Lua 5.1 features in the BIOS
* `http_enable` [true]: Whether to enable the `http` API
* `ignoreHotkeys` [false]: Whether to ignore hotkeys such as F2, F3, F11
* `isColor` [true] (computer-local): Whether the emulated computer is an Advanced Computer (color) or Standard Computer (no color)
* `maximumFilesOpen` [128]: Maximum number of files that can be open at once
* `mount_mode` [2]: Specifies security settings for mounting directories
  * `none` (0): Do not allow mounting directories
  * `ro strict` or `ro_strict` (1): Force all mounts to be read-only
  * `ro` (2): Mounts default to read-only if not explicitly specified
  * `rw` (3): Mounts default to read-write unless marked read-only (v2.1.2 and below behavior)
* `romReadOnly` [true]: Whether the ROM is mounted as read-only (change this only if you know what you're doing!)
* `vanilla` [false]: Whether to disable all CraftOS-PC-specific features

## Changing variables
Configuration variables can be changed using the "config" shell command, the `config` API, or by editing the JSON files manually.

### From the shell
The "config" program allows you to change configuration variables from the shell. It has three subcommands: "get", "set", and "list". The "get" command will print the current value of a variable, "set" will change the value of a variable, and "list" will list all of the variables and their values. For example, "config set http_enable false" will disable the `http` API and all programs that use the Internet.

### From Lua
The `config` API is the Lua interface to the configuration. `config.get(name)` will return the value of a variable, and `config.set(name, value)` will set the value of a variable. To list the variables available, `config.list()` returns a table with the names of each configuration variable available, and `config.getType(name)` returns the type a variable expects as a string.

### Manually
The configuration is stored at `.craftos/config` in the user's home directory. This folder contains a file named `global.json` that stores the configuration global to all computers; as well as one JSON file for each computer ID that stores local configuration variables. These JSON files can be edited manually to set the variables, but note that the config will not be reloaded until CraftOS-PC is fully quit (all computers closed) and relaunched.