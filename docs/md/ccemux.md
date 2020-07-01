# Migrating from CCEmuX
CraftOS-PC v2.2 introduces an auxiliary tool that allows you to seamlessly port your old data from CCEmuX into CraftOS-PC. This tool preserves all of your computer data as well as most options that may be set in `ccemux.json`.

## How to use
1. Download the tool [directly from the v2.2 release](https://github.com/MCJack123/craftos2/releases/download/v2.2/CCEmuXConverter.jar).
2. Double-click it or run it with `java -jar CCEmuXConverter.jar`.
3. Wait for it to complete (a dialog will pop up if it succeedes).
4. Open up CraftOS-PC. Your old files will be available on the same computers as they were in CCEmuX.

## Supported options
* `maximumFilesOpen` => `maximumFilesOpen`
* `maxComputerCapacity` => `computerSpaceLimit`
* `httpEnable` => `http_enable`
* `disableLua51Features` => `disable_lua51_features`
* `defaultComputerSettings` => `default_computer_settings`
* `debugEnable` => `debug_enable`
* All files on all computers will be copied over

## Command-line flags
CraftOS-PC v2.3.4 adds a number of new flags to make it a snap-in replacement for any tools that may use CCEmuX flags. These flags include:
* `-a|--assets-dir <dir>`:            Sets the CC:T directory that holds the ROM & BIOS (must contain an `assets/computercraft/lua` folder inside)
* `-C|--computers-dir <dir>`:         Sets the directory that stores data for each computer
* `-c=|--start-dir <dir>`:            Sets the directory that holds the startup computer's files
* `-d|--data-dir <dir>`:              Sets the directory that stores user data
* `--plugin <file>`:                  Adds an additional plugin to the load list
* `-r|--renderer [renderer]`:         Lists all available renderers, or selects the renderer

With these arguments, you can seamlessly replace `java -jar ccemux-launcher.jar` in any script with `craftos`.