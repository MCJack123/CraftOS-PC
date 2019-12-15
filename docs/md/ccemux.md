# Migrating from CCEmuX
CraftOS-PC v2.2 introduces an auxiliary tool that allows you to seamlessly port your old data from CCEmuX into CraftOS-PC. This tool preserves all of your computer data as well as most options that may be set in `ccemux.json`.

## How to use
1. Download the tool [from the v2.2 release](https://github.com/MCJack123/craftos2/releases/download/v2.2_01/CCEmuXConverter.jar).
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