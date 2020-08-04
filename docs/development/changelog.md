# Changelog
## v2.4 - ?
* Added new GUI terminal that uses hardware rendering (experimental)
  * It uses the GPU to accelerate drawing graphics
  * Uses the same base code that was used prior to v2.1, with updates that have been added since
  * Support can be enabled with the `useHardwareRenderer` config option or the `--hardware` or `-r hardware-sdl` CLI flag
  * A test script is available to see which is better for your system
  * Vsync can be enabled with the `useVsync` option
  * The driver to use can be selected with the `preferredHardwareDriver` config option or the `-r` CLI flag
    * These are all of the possible drivers:
      * `direct3d`
      * `direct3d11`
      * `directfb`
      * `metal`
      * `opengl`
      * `opengles`
      * `opengles2`
      * `software`
    * Some drivers may not be available on your system
    * Use `craftos -r` to list all available drivers
* Updated CC:T version to 1.90.2
  * Add cc.image.nft module, for working with nft files. (JakobDev)
  * Add configuration to control the sizes of monitors and terminals. (`defaultWidth`/`defaultHeight`)
  * Fix string serialization error in textutils.serializeJSON.
* Added ID to per-computer config error messages
* Added support for `monitor_touch` event as expected
  * This removes the `mouse_*` events for monitors
  * The previous behavior can be restored by setting the `monitorsUseMouseEvents` config setting
    * This will also add the monitor's side as a fourth parameter
* Fixed a race condition in `periphemu.detach`
* Disabled access to `romReadOnly` from CraftOS
* Added proper double-buffering to the terminal
  * This allows you to use the `term` API while CraftOS-PC is rendering
  * This speeds up programs that end up running lower than the render FPS
* Modems now act as wired modems and can be used to access non-local peripherals (#122)
  * Non-local peripherals can now be listed with `peripheral.getNames()` when a modem is attached
* Fixed a crash when opening a debugger twice (#120)
* Fixed a rare race condition while getting an event (#123)
* Fixed an issue with saving screenshots to disk
* Fixed a bug where function key hotkeys don't work when Caps or Num lock is enabled
* Added `startFullscreen` per-computer config option
* Fixed `bit32.lrotate` returning incorrect results
* Added `standardsMode` config option for strict compatibility with CC:T/CCEmuX
  * Forces time readings & timer resolution to be rounded to 50 ms (1 tick)
  * Adds back colored margins as shown in CC
  * More compatibility tweaks may be added under this option
* Fixed crash when closing CraftOS-PC while a WebSocket is shutting down
* Fixed crash when using too many nested coroutines (#124)
  * This was due to a bug that didn't update the C call count properly
  * Calling too many nested coroutines will result in a "C stack overflow" error
* Fixed raw terminals getting the same ID
* Added some more locks on timers to prevent crashes
* Fixed abort timeout not working before first yield
* Fixed missing UK spelling of term.nativePaletteColour
* Fixed modem hang due to locks not waiting
* Fixed missing modem distance field in `modem_message` event
* Fixed utf8.char returning `%U` for each character
* Fixed a random crash when calling a NULL C function (this shouldn't happen)
* Fixed styling of message dialogs on Windows
* Fixed events going to the wrong window in raw mode
* Fixed Ctrl-R/S/T shortcuts not working in non-GUI modes
* Windows: The solution now uses vcpkg for dependencies, so NuGet and separate builds are no longer required
* Windows: PDF printing is now supported in all builds
* Windows: Changed Visual C++ Runtime and other libraries to dynamic linking
  * This reduces executable size, but the VCRT redistributable is now strictly required
  * More DLLs will be required as well

## v2.3.4 - June 29, 2020
* Updated CC:T version to 1.89.1
  * This includes full testing on the CC:T test set
  * CraftOS-PC now fully passes all CC:T tests
* Added an error dialog when an error occurs reading the configuration files
  * The dialog includes a message describing where the JSON parsing error occurred
  * If an error occurs, the defaults will be used, and no changes will be saved
* Added proper `ingame` locale for `os.day/time/epoch`
  * This is based on a 20-minute clock that starts when the computer boots
  * This change is to improve compatibility with CCEmuX/CC:T
* Added CCEmuX command-line flags
  * `--assets-dir`, `--computers-dir`, `--start-dir`, `--data-dir` (alias of `--directory`), `--plugin`, `--renderer`
  * The `--start-dir` flag only affects the initial computer (specified by `--id`)
* Added `--exec` command line option to run inline code without a file
* Headless mode now reports a color terminal (for advanced testing)
* `os.time` now properly parses tables returned by `os.date("*t")`
* CraftOS-PC now reports its real version and CC version in HTTP User-Agent strings
* `fs.delete` no longer errors when deleting a non-existent file
* Fixed `io.open` creating a directory instead of opening a file in write mode (#116)
* Fixed `fs.getDrive` returning the wrong results
* Fixed a whole bunch of warnings
* `fs.getSize` now returns 0 when used on a directory instead of erroring
* Fixed a bug causing audio glitches when playing low notes through the speaker
* Fixed an error when writing `nil` or a number to a file (#118)
* Fixed a crash when an invalid format string is passed to `os.date`
* Fixed missing cc.completion and cc.shell.completion modules
* Fixed programs getting the path to the program in arg[0] instead of the command as it was run
* Raised maximum Lua call depth to 32768 (from 256)
* `loadstring` now automatically adds an `=` sign to the chunk name
* Fixed `debug.getlocal` not returning function parameter names
  * This fixes the `cc.pretty` module's parameter detection function
* Fixed vulnerability in `io` library
* Fixed `io.lines()` with no arguments
* Fixed missing `*L` option for `io.read`/`file:read`
* Fixed `io.write`/`file:write` not returning file handle
* Fixed `string.format` erroring when using nil as a string parameter
* `fs.copy` can now copy folders as expected
* Fixed `fs.find("/")` returning an empty table
* Fixed `fs.attributes` having the wrong name
* Fixed `fs.makeDir` not erroring when it tries to create a directory where a file is already present
* Fixed a boatload of string differences to comply with CC: Tweaked
* Fixed a bunch more small inconsistencies
* Fixed `io.open` not creating all parent directories if they're missing
* Added support for custom options to `io.lines`
* Fixed support for '+' modes in `io.open`
* Fixed errors in Lua prompt showing `[string "lua"]:` instead of `lua:`

## v2.3.3 - June 6, 2020
* Added a `record` domain to drives
  * Inserting a disk in the format `record:<name>` will insert a music disc from `minecraft:music_disc.*` in the speaker sound data
  * `disk.insertDisk("left", "record:cat")` will insert the "cat" music disc from the sound files as a playable music disc
* Updated `gist` (again)
* Fixed an error preventing the debugger from starting up
* Fixed `fs.readLine` returning weird strings on empty lines (#113)
* Fixed an error when writing numbers to the screen
* Fixed a bug that overrode User-Agent and Content-Type HTTP headers
* Fixed audio clipping when playing pitched sound through the speaker
* Fixed a crash when playing some notes on Windows
* Fixed stack corruption in the debugger
* Fixed origin point of paintutils calls in graphics mode
* Fixed a bug that may lead to events being sent with the wrong parameters
* Computers now shut down automatically if the BIOS exits

## v2.3.2 - May 23, 2020
* Feature parity with CC: Tweaked 1.88.1
  * Add peripheral.getName - returns the name of a wrapped peripheral.
  * The Lua REPL warns when declaring locals (lupus590, exerro)
  * Add fs.isDriveRoot - checks if a path is the root of a drive.
  * cc.pretty can now display a function's arguments and where it was defined. The Lua REPL will show arguments by default.
  * Move the shell's require/package implementation to a separate cc.require module.
* CraftOS-PC builds with the CC: Tweaked ROM are now available
  * These builds use the stock ROM, with CraftOS-PC-specific programs included
  * Some ROM features (notably, autocomplete for CCPC programs) may not be available
  * CC:T Edition will replace the standard CraftOS-PC ROM, so they can't be used alongside each other
    * This does not apply to Mac builds, which are distributed as single apps
  * Ubuntu: Install the `craftos-pc-cct-data` package to use the CC:T ROM
* `bit32` is now the default bit API
  * The BIOS will set up a wrapper to allow programs to continue using `bit`
* Added `file.readLine` to file handles opened in binary mode
* Added `getLabel` method to computer peripherals
* Rewrote Gist program again
  * This will be changing once again in the next version
* Added new plugin capabilities
  * `register_queueTask`: Returns a function of the form `void* queueTask(std::function<void*(void*)> func, void* userdata, bool async)`
  * `register_getComputerById`: Returns a function of the form `Computer * getComputerById(int id)`
  * `get_selectedRenderer`: Returns a number representing the currently selected renderer
* Capability callbacks now receive the name of the function it's called for
* `plugin_info` can now safely throw errors
  * If a plugin throws an error here, its API will not be loaded and the error will be reported to the user on boot
* Added SDLTerminal::resizeWholeWindow, which resizes a terminal and its window
* Fixed `file.readLine` only returning up to 255 characters
* Fixed a possible race condition

## v2.3.1 - May 9, 2020
* CraftOS-PC is now available as a notarized build on Mac
  * This means it is no longer necessary to right-click the app to open it for the first time
* Added new crash handler that outputs a stack trace for debugging
  * Mac & Linux builds will output the stack trace to the console
  * Windows builds will only show a dialog showing a crash occurred; the actual stack trace will be saved in a minidump
  * Mac app builds will show a crash report dialog as usual
* Added mouse_move event (disabled by default)
  * The `mouse_move_throttle` config option sets the amount of time between events sent
  * It is disabled by default because SquidDev-CC/CC-Tweaked#434 is still in progress
    * Set `mouse_move_throttle` to a whole number (50 is recommended) to enable
* Added file.readAll for binary file handles
* Added maxOpenPorts config option to cap maximum number of open ports
* Added a couple of upcoming CraftOS features from CC: Tweaked upstream
* Added `term.showMouse` to toggle whether the real mouse cursor should appear
* Added startComputer capability to plugins
* Added return value from `config.set` specifying when the change will take effect
* Improved error message reporting across the board
* Using non-vanilla programs in vanilla mode now shows a descriptive error
* Fixed crash when creating directories
* Fixed term.drawPixels not working properly for table arguments when in mode 1
* Fixed writing text files with binary by writing in UTF-8
* Fixed crash when an HTTP request times out
* Fixed a security vulnerability involving the drive peripheral
* Fixed multiple mouse_drag events being sent for the same position (#107)
* Fixed computer not unpausing when closing debugger
* Fixed mount dialog showing incorrect text relating to read-write mount
* Fixed some bugs with the modem
* Fixed a bunch of small memory leaks & issues
* Fixed a race condition when taking a screenshot
* Fixed a bug where the size operator of a table may not represent its actual size
* Fixed a crash when using a modem or debugger after rebooting
  * This was done by adding a `reinitialize` method to peripherals
    * This method is called after restarting a computer while having the peripheral attached
    * Use this if your peripheral holds any references to the computer's Lua state or a sub-thread
* Fixed a bug where coroutines created before attaching a debugger won't be able to be paused from the debugger when resumed
* Fixed `http.get` and `http.request` not allowing using a table as a parameter
* Fixed a bug where the computer wouldn't boot when `disable_lua51_features` is enabled (#110)

## v2.3 - April 26, 2020
* Massively improved performance of emulation
  * Speed issues are caused by the debugger's hooks (specifically line hooks)
  * This version only enables the required hooks depending on what features are required
  * In general, more debugging features -> lower performance
  * Depending on the machine, expect between 4-20x faster emulation
* Added official support for WASM, including an online client (CraftOS-PC Online)
  * CraftOS-PC Online is available at https://www.craftos-pc.cc/online/
  * Supports Chrome/Chrome-based browsers, and new versions of Firefox with the following options enabled in `about:config`:
    * `javascript.options.shared_memory`
    * `dom.postMessage.sharedArrayBuffer.withCOOP_COEP`
    * `browser.tabs.remote.useCrossOriginEmbedderPolicy`
    * `browser.tabs.remote.useCrossOriginOpenerPolicy`
* Added speaker peripheral
  * Includes open-source sounds for notes
  * Users can manually add in custom sounds (including offical Minecraft ones)
    * See https://www.craftos-pc.cc/docs/periphemu#speaker-sounds for more info
* Updated CC:T compatibility to 1.87.1
  * Added `fs.getAttributes` and `fs.getCapacity` functions
  * Added optional timeout argument to `websocket.receive`
  * Ported pretty printer to `lua.lua`
  * Added `__len` metamethod for tables
  * Strings now accept `\xNN`, `\u{NNN}`, and `\z` escape codes
  * Added `utf8` library
  * Added base argument to `math.log`
  * Moved `table.pack` and `table.unpack` out of the ROM and into C
  * Added `textutils.unserializeJSON`
  * Rewrote `settings` API
  * Enabled MOTD by default
  * `http.post` now accepts a table as an argument as expected
* Added raw terminal renderer
  * See the documentation (https://www.craftos-pc.cc/docs/rawmode) for more info
* Added TRoR (Terminal Redirect over Rednet) terminal renderer
* Added the ability to place modems on multiple separate networks
  * This can be done by adding a third argument when attaching the peripheral, specifying the network ID
  * Modems with different network IDs won't be able to communicate with each other
* Added prompt when mounting a real directory, for security
  * This is to mitigate the possibility that a malicious script deletes arbitrary files
  * A prompt also appears when changing the `mount_mode` option
  * To disable this (not recommended), set `showMountPrompt` to false in global.json
    * This option cannot be changed inside CraftOS-PC
* Added filesystem merge mount support
* Added standalone executable option for Windows & Linux
* Added scrollback to debugger console
* Added pop-up when a computer is hung and ignores terminate events
* Revamped `gist` program with new commands
  * Added `edit`, `delete`, and `info` commands
  * Gist logins now use Personal Access Tokens instead of a private server with OAuth2
* Improved command-line usage
* Cursor color can now be changed as expected
* Fixed 256-color graphics mode on monitors
* Fixed crash when receiving tables over a modem connection
* Fixed a crash relating to timers
* Fixed memory leak when taking a screenshot on Mac
* Fixed missing Content-Type and Content-Length headers in HTTP requests
* Fixed mouse event location in graphics mode when using an HD font
* Fixed a crash when an error occurs while creating a peripheral
* Fixed missing error messages when an HTTP connection fails
* Accessing the string metatable is no longer blocked
* Removed path argument to `term.screenshot()`
* Added a rate limit to `term.screenshot()`

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
  * See [the documentation](https://www.craftos-pc.cc/docs/debugger) for more information
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
