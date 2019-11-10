# CC: Tweaked Features
CraftOS-PC emulates most of the features available in [CC: Tweaked](https://github.com/SquidDev/CC-Tweaked). Here is the list of features that have been ported to CraftOS-PC:

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

Programs that use CC: Tweaked features should work well on CraftOS-PC.