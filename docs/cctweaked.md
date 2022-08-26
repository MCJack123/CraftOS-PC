# CC: Tweaked Features
CraftOS-PC emulates all of the features available in [CC: Tweaked](https://github.com/SquidDev/CC-Tweaked). CraftOS-PC v2.7 is verified to have feature parity with CC:T 1.100.9, and passes all tests used by CC: Tweaked. As of CraftOS-PC v2.5, the CC:T ROM files are used instead of the ComputerCraft 1.8 files, further enhancing compatibility and support. Here are some of the features that have been ported to CraftOS-PC:

* WebSocket support
* `monitor.getTextScale()` method
* "wget" extensions
* Bytecode loading in `load()` function (requires `debug_enable`)
* Automatic HTTPS redirecting
* `term.nativePaletteColor()` function
* `colors.rgb8()` split into `colors.packRGB()` and `colors.unpackRGB()`
* Multishell tab scrolling
* Warnings & URL support in "pastebin"
* `os.time()`/`os.date()` arguments are case-insensitive
* `file.seek()` methods
* Improved IO library
* New Lua 5.3 features
  * `__len` metamethod for tables
  * Strings accept `\xNN`, `\u{NNN}`, and `\z` escape codes
  * Added `utf8` library
  * Added base argument to `math.log`
* `fs.attributes` and `fs.getCapacity` functions
* `websocket.receive` accepts timeout argument
* New pretty printer module
* Add `peripheral.getName` - returns the name of a wrapped peripheral.
* The Lua REPL warns when declaring locals
* Add `fs.isDriveRoot` - checks if a path is the root of a drive.
* Move the shell's `require`/`package` implementation to a separate `cc.require` module.
* Add getter for window visibility (devomaa)
* Use term.blit to draw boxes in paintutils (Lemmmy).
* Fix several programs using their original name instead of aliases in usage hints (Lupus590).


Programs that use CC: Tweaked features should work well on CraftOS-PC.