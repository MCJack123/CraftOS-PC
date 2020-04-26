# CC: Tweaked Features
CraftOS-PC emulates all of the features available in [CC: Tweaked](https://github.com/SquidDev/CC-Tweaked). CraftOS-PC v2.3 is verified to have feature parity with CC:T 1.86.2, and includes some pre-release features that will be shipping with 1.87.0. Here are some of the features that have been ported to CraftOS-PC:

* WebSocket support
* `monitor.getTextScale()` method
* "wget" extensions
* Bytecode loading in `load()` function (requires `debug_enabled`)
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


Programs that use CC: Tweaked features should work well on CraftOS-PC.