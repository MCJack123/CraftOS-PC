# Changelog
## v2.3 - ?
* Massively improved performance of emulation
  * Speed issues are caused by the debugger's hooks (specifically line hooks)
  * This version only enables the required hooks depending on what features are required
  * In general, more debugging features -> lower performance
* Added speaker peripheral
  * Includes open-source sounds for notes
  * Users can manually add in custom sounds (including offical Minecraft ones)
* Updated CC:T compatibility to 1.87.0 (preview)
  * Added `fs.attributes` and `fs.getCapacity` functions
  * Added optional timeout argument to `websocket.receive`
  * Ported pretty printer to `lua.lua`
  * Added `__len` metamethod for tables
  * Strings now accept `\xNN`, `\u{NNN}`, and `\z` escape codes
  * Added `utf8` library
  * Added base argument to `math.log`
* Added raw terminal renderer
  * See the documentation (https://www.craftos-pc.cc/docs/rawmode.html) for more info
* Added TRoR (Terminal Redirect over Rednet) terminal renderer
* Added filesystem merge mount support
* Added standalone executable option for Windows & Linux
* Added scrollback to debugger console
* Added official support for WASM

## v2.2.6 - March 15, 2020
* Added gist.lua to the default ROM
* Reboot now resets graphics mode
* Added `--rom` flag to allow changing ROM directory (#84)
* Fixed extended ASCII character input conversion (#85)
* Fixed key events not being sent when Ctrl+[TSR] are pressed (#86)
* Fixed bug in fs.getFreeSpace
* Fixed term.drawPixels cutting off bottom
* Fixed crash when rebooting with events in queue
* Fixed disk mount paths
* Fixed deadlock when a peripheral method causes an error
* Fixed getPixel boundaries being too small
* Fixed paste events sending \r characters on Windows (#95)

## v2.2.5 - February 24, 2020
* Added `--directory` argument to specify custom data directory
* Added `--id` argument to specify launch computer, overriding `initialComputer` config option
* Rewrote `--script` argument to no longer shadow real `startup.lua` (#83)
* Added header option to `http.websocket` to match CC: Tweaked behavior (#82)
* Fixed crash when writing below screen
* Fixed crash when closing WebSocket
* Fixed terminal background not being affected by palette changes

## v2.2.4 - February 14, 2020
* Computer label now displays in title bar (including the terminal emulator's title in CLI mode)
* Added `cliControlKeyMode` config option (#78, #79)
* Added `--args` argument to command line to pass arguments to `--script` (#78)
* Added UTF-8 support over HTTP
* Unicode characters are now replaced with '?' (rather than being dropped)
* `file.read()` now accepts a length in text mode
* Insecure WebSockets ('ws://') no longer attempt to use secure WebSockets
* Fixed WebSocket connection failure when no path is provided
* Fixed crash when closing computer with open WebSockets
* Fixed crash in `fs.list()` when a non-string argument is passed (#77)
* Fixed crash when closing computer with running timers
* Fixed crash when reading a string with an invalid UTF-8 codepoint
* Fixed crash when too many events are queued
  * This also fixes a crash when pasting long text in CLI mode
* Fixed glitch/crash when resizing CLI window (#78, #80)
* Fixed issue with clicking the mouse in CLI mode (#78)
* Fixed 100% CPU usage when using CLI mode
* Fixed `term.setCursorPos()` clamping the cursor to `[0, width)`
* Fixed `term.clear()` filling with black/white instead of selected BG/FG combo
* Fixed `file.readAll()` on Windows when the file has no end newline
* Fixed issue when reading single character at a time from text files
* Fixed POST data stopping at NUL characters
* Made some HTTP error messages more descriptive
* Fixed HTTP implementation in WASM port
* Added `--enable-wasm` flag to './configure' to allow building for WASM
* Added window switcher for WASM builds
* Fixed debugger locals once again
* `table.concat()` now works with non-contiguous tables
* Fixed crash when a computer's config file was corrupt or empty

## v2.2.3 - January 13, 2020
* Added `useHDFont` virtual config option
* Added support for reading UTF-8 files
* Pressing enter in the debugger's Call Stack tab now keeps file open
* Stepping multiple lines in the debugger now works as expected
* Fixed accessing locals in the debugger
* Updated cash to latest version
* NUL bytes in string patterns no longer mark the end of the pattern
* `io.input()`/`io.output()` no longer fail when called with `io.stdin`/`io.stdout`, `io.stderr` (#75)
* Fixed bug that caused `file.read(x)` on binary files to always return one byte
* Fixed segmentation fault when Lua crashes
* Fixed some bugs relating to vanilla mode (#76)
* Added preliminary Emscripten/WASM support (#73)

## v2.2.2 - January 2, 2020
* Feature parity with CC: Tweaked 1.86.0
* Added MOTD (disabled by default)
* Added Ctrl+S and Ctrl+R hotkeys (#70)
* Added configurable recording length and framerate
* Fixed crash when resizing window to a smaller size (#71)
* fs.makeDir no longer errors when creating a directory that already exists
* io.write no longer adds a newline to the end of the string (#68)
* os.setComputerLabel no longer errors when no label is provided (#69)
* Fixed string length bug in debugger.print

## v2.2.1 - December 21, 2019
* Added cash 0.3 as an optional shell (set bios.use_cash in the settings)
* Added help files for CraftOS-PC features
* Improved speed of terminal writing
* Reduced processing time used by terminal hook
* Verified compatibility with CC: Tweaked using official tests
* Fixed a security flaw that allowed modification of read-only mounts
* Resolved an issue that prevented monitors from drawing
* Fixed a bug where secure WebSockets failed to connect with "WebSocket Exception"
* Fixed a possible deadlock when stepping the debugger
* Removed turtle, pocket, command programs; removed bmpview
* Added --small flag to screenfetch

## v2.2 - December 15, 2019
* Added F12 hotkey to copy screenshot to clipboard (Windows & Mac only)
  * Calling `term.screenshot("clipboard")` will have the same effect
* Fixed default IO handles (stdin/out/err)
* Changed `_HOST` variable to more accurately represent ComputerCraft
* Fixed `delete.lua`
* `wget.lua` no longer requires a file name (CC:T behavior)
* Added `register_termQueueProvider` capability, which recieves the address of the `void termQueueProvider(Computer *comp, const char *(*callback)(lua_State*, void*), void* data)` function

## v2.2p1 - December 1, 2019
* Added new debugger peripheral
  * Opens in separate window
  * Four tabs available
    * Debugger: GDB-style debugging terminal
    * Call Stack: Visual backtrace viewer, shows files
    * Profiler: Measures function call count & time
    * Console: Allows printing debug messages outside of the main terminal
  * Computer can be paused with `debugger.break()`, `debug.debug()`, or Ctrl-T in debugger
  * See [the documentation](https://www.craftos-pc.cc/docs/debugger.html) for more information
* Added breakpoints
  * Can be set with `debugger.setBreakpoint(file, line)` or `debug.setbreakpoint(file, line)`
  * Does not require debugger to be attached
    * When no debugger is available, `lua.lua` is executed
* Fixed #1 ("attempt to yield across metamethod/C-call boundary" when using pcall)
  * Tracebacks/errors now function normally
  * This was accomplished with a patch that allows yielding across pcall's in Lua 5.1.0
    * Thanks to [EveryOS](https://github.com/JasonTheKitten) for sharing the patch and for sending me a fixed version for 5.1.5
* Moved per-user save directory to more platform-appropriate locations
  * Windows: `%appdata\CraftOS-PC`
  * Mac: `~/Library/Application Support/CraftOS-PC`
  * Linux: `$XDG_DATA_HOME/craftos-pc` (usually `~/.local/share/craftos-pc`)
  * Data will be migrated when running CraftOS-PC v2.2 for the first time
* Added brand-new plugin API
  * Plugins should now provide a `plugin_info` function
  * This function pushes a table with the API version and requested capabilities onto the Lua stack
  * Capabilities are requested by adding a callback function for a function in CraftOS-PC
  * These callbacks will recieve the requested function as Lua userdata as the first value on the stack
  * Available capabilities in v2.2:
    * `register_getLibrary`: Recieves the address of the `library_t * getLibrary(std::string name)` function
    * `register_registerPeripheral`: Recieves the address of the `void registerPeripheral(std::string name, peripheral_init initializer)` function
    * `register_addMount`: Recieves the address of the `bool addMount(Computer * comp, const char * real_path, const char * comp_path, bool read_only)` function
* Added new config options
  * `vanilla`: Set to `true` to disable all CraftOS-PC features
  * `initialComputer`: The first computer that starts when opening CraftOS-PC
* Added `periphemu.names()` which returns a list of all available peripherals (unsorted)
* Added `term.drawPixels(x, y, lines)` which draws a table of lines at a position
  * Each line can either be a string or a table of individual pixels
* Fixed `debug.sethook`, `debug.gethook`
* `debug.debug()` now functions the same as hitting a breakpoint
* Added hooks for errors, coroutine resumptions and yields
  * Running `catch error` in the debugger will pause execution when an error occurs
  * Errors are logged to stdout if the `logErrors` config option is enabled
* Fixed a bug when creating directories
* Fixed timers with <= 0 length
* Fixed printing extended characters in the console
* Rewrote implementation of the modem peripheral
  * Tables and strings are now properly copied
  * Fixed `rednet` API
* Replaced Lua plugin loader with custom loader
* Made SDL_mixer an optional dependency
* Fixed many more bugs

## v2.1.3 - November 3, 2019
* Added two new configuration variables
  * `mount_mode` allows restricting mounting to read-only or disabled
    * `none` (0) disables mounting altogether
    * `ro strict` or `ro_strict` (1) forces mounts to be read-only
    * `ro` (2) sets mounts to read-only by default (default option)
    * `rw` (3) sets mounts to read-write by default (v2.1.2 behavior)
  * `configReadOnly` disables `config.set()`
* Bugfixes
  * #57: config.get("readFail") returns not real nil
  * #58: Crash on macOS on rebooting
  * #60: `edit` causes segfault when a line goes off the screen if there are more than ~100 lines in a file
  * Fixed crash when non-ASCII characters are present in computer label
    * Computer labels are now stored in Base64 by default; if you want to change the label in the JSON file, simply set `computerLabel` to the ASCII label and remove the `base64` key.

## v2.1.2 - October 23, 2019
* Fixed some crashes on reboot/quit
* Fixed list subcommand of config
* Changed return value of `config.getType()` to type-string
* Added PNG screenshot support for Windows builds
* Fixed "not supported" icon on macOS versions below Catalina
* Added launcher icon on Linux

## v2.1.1 - October 16, 2019
* Fixed http handle methods when using binary mode
  * `wget` now works as expected
* Fixed `os.clock()` implementation
* Fixed a bug regarding embedded `\0` characters
  * `term.write()` can now print strings with NUL characters
  * String patterns do not work with NUL characters in the query string
* Removed auto-updater on platforms other than Windows & Mac
  * These systems can either update through a package manager or rebuild from the release source
* Ubuntu PPA: Fixed CLI support
* Mac: Moved license to `LICENSE.txt` in disk image
  * Requiring the license to be agreed to breaks the auto-updater

## v2.1 - October 13, 2019
* Added 256 color mode
  * This can be activated with `term.setGraphicsMode(2)`
  * Use numbers 0-255 to choose color instead of `colo(u)rs` API
  * Colors 0-15 are set to default colors, use `term.setPaletteColor([0-255], r, g, b)` to set color palette
* Added auto-updater, allowing one-click installation of new updates (Windows/Mac only)
* Added custom fonts
  * Set `customFontPath` to the (real) path to the font (BMP format only)
  * Set `customFontScale` to the font scale
    * 1 = HD font (12x18), 2 = normal font (6x9), 3 = 2/3 size font (4x6)
* Fixed graphics issues on Linux with NVIDIA graphics
  * Renderer has been rewritten to fix this
  * Should improve performance when using a reasonable number of windows
    * May degrade performance when using >1000 windows at once on a slow system
* Added CLI mode
  * This can be activated with the `--cli` option
  * Not available on Windows (use WSL if necessary)
* Added more HTTP methods
* Added fullscreen hotkey (F11)
* Added `romReadOnly` config option
* Added Ubuntu 19.10 & Arch packages
* Added autoconf script to compile
* Many bugfixes
  * Fixed compositor disabling on KDE
  * Fixed `monitor.setTextScale`
  * Fixed `term.screenshot`
  * Fixed `fs.getDrive`
  * Fixed window resizing on Linux
  * Fixed many compilation warnings
  * Cleaned up code to be more C++-like

## v2.0.1 - September 13, 2019
* Added automatic update checking
  * Pops up a window alerting the user about the new version
  * Can be disabled with the `checkUpdates` config option
  * Will be expanded into an auto-updater in v2.1
* Added `term.setPaletteColor(color, hex)` syntax
* Fixed plug-in loading on Mac
* Fixed computer label always getting reset to `true`
* Fixed `ignoreHotkeys` not being saved

## v2.0 - September 8, 2019
* Fixed high CPU usage, now uses ~5% CPU at idle
* Moved plugin directory on Mac to `CraftOS-PC.app/Contents/PlugIns` 
* Fixed HTTP requests

## v2.0p1 - August 25, 2019
* Added WebSocket support
  * `http.websocket(url)` will open a client WebSocket connecting to `url`
  * `http.websocket()` will open a server WebSocket that can be connected to
* Added plugin/module system
  * Add plugins in the `<installation directory>/plugins` folder
  * See [`DOCUMENTATION.md`](https://github.com/MCJack123/craftos2/blob/master/DOCUMENTATION.md) for more details
* Added `file.seek` method
* Added `io` library with proper filename redirects
* Added `drive` peripheral
  * Use disk.insertDisk(*string* path) to mount a folder or audio file
  * Use disk.insertDisk(*number* id) to mount a floppy disk from `~/.craftos/computer/disk/<id>`
* Added a whole bunch of features from CC: Tweaked, making CraftOS-PC mostly compatible with CC:T
* Added new ROM features
* Moved font into executable (no longer requires `craftos.bmp`)
* Redid HTTP client/server code, removing some dependencies (expect bugs)

## v2.0b3 - August 20, 2019
* Rewrote codebase to pure C++
* Added multi-computer support
  * Computers can be added with `periphemu.create(<id>, "computer")`
  * Can be added from the shell with `attach <id> computer`
  * Both forms attach the computer peripheral to the current computer
* Added modem peripheral
  * Still WIP, expect some bugs
* Added GIF recording support
  * Press F3 to toggle recording
  * Shows red circle in corner while recording
  * Limited to 15 seconds for performance reasons
  * Saves to `~/.craftos/screenshots/<time>.gif`
* Added coroutine override to partially solve some problems in #1 
* Moved Windows install directory to 64-bit Program Files
* `.craftos` directory is now created on boot
* Reimplemented fs.find, fixing #4 (fs.find returns {} on Windows)
* Added some CC: Tweaked features
  * #16 (Add monitor.getTextScale())
  * #24 (Add automatic HTTPS requests)
  * #25 (Add term.nativePaletteColor())
  * #29 (Make os.time() and os.date() case-insensitive)
* Moved all dynamic libraries into Mac app (fixes dyld errors)
* Added switch to auto-run script (--script <file path>)
* Added switch to run headless from the console (--headless) (does not work on Windows build, recompile for the console subsystem to use)

## v2.0b2 - August 13, 2019
* `mounter` API
* HTTP server listeners
* Terminal & monitor resizing
* Window icons
* Holding Ctrl-T sends `terminate` event
* Added built-in screenshots
  * Take a screenshot with F2 or call `term.screenshot(path)`
    * `path` is a global path outside of CraftOS and is optional
  * Saved to `~/.craftos/screenshots` by default
* Added some configuration variables
  * `debug_enable (false)`: Set to true and reboot to enable debug API (or disable removal)
  * `ignoreHotkeys (false)`: Set to true to disable hotkeys (F2)
  * `isColor (true)`: Toggles whether the computer is an Advanced Computer or Standard Computer
* Distributed builds now use the CraftOS-PC ROM instead of the ComputerCraft ROM
* Moved `~/.craftos/config.json` to `~/.craftos/config/global.json`
* Big changes under the hood
  * Switched to software rendering from hardware rendering (see #5)
  * Rearranged a bunch of the code in preparation for multiple computers
  * Changed event queuing system to put parameter threads under a separate state rather than the main state
    * This should a) reduce memory leakage or b) improve event stability

## v2.0b1 - August 7, 2019
* Near full compatibility with ComputerCraft 1.8
* `config` API - adjust ComputerCraft configuration
* `periphemu` API - attach peripherals to the computer
  * monitor
  * printer
* Terminal graphics mode
* debug API access
