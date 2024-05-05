# Standards Mode
CraftOS-PC attempts to retain as much compatibility as possible with standard ComputerCraft to keep the experience consistent. However, some tweaks are put in place to allow certain capabilities (such as <50ms timers) at the expense of possible compatibility. Standards mode reverses these tweaks, allowing more compatibility if desired.

## Enabling
Standards mode is exposed through the `standardsMode` config option. From the shell, running `config set standardsMode true` will enable standards mode. `config set standardsMode false` will turn it back off. It can also be accessed from the `config` API or `global.json` as usual.

## Changes
These are the behaviors that change when standards mode is enabled.

* The abort timeout (`abortTimeout`) is locked at 7 seconds, and cannot be changed. However, it does not mutate the actual config option.
* Extended margins (`extendMargins`) are enabled, and cannot be disabled. However, it does not mutate the actual config option.
* DFPWM audio (`useDFPWM`) is enabled, and cannot be disabled. However, it does not mutate the actual config option.
* Timers and alarms are rounded to the nearest 50ms (1 "tick"), and always take at least 50ms to fire (a length of 0 does not fire immediately).
* `os.epoch("ingame")` returns a value rounded to 50ms (1 "tick").
* `fs.getFreeSpace` and `fs.getCapacity` will calculate the actual free space/capacity based on the value of `computerSpaceLimit`. However, this limit is not enforced, and if the space used exceeds `computerSpaceLimit`, `fs.getFreeSpace` returns a negative number.
* Errors no longer show dialog boxes, instead displaying the error on the terminal and suspending execution as expected in ComputerCraft. The window stays on the screen until closed.
* If a computer does not yield for 10 seconds (3 seconds more than the abort timeout), it is hard-stopped, and an error message is displayed as described above.
* Mouse clicks on buttons > 3 (not left/middle/right) are ignored, and no event is sent.
* The `load` function is now resumable (you can call `coroutine.yield` from it); however, this is experimental, and uses threads to make this possible. Expect some performance loss due to this.
* Parameters to `os.queueEvent` are copied instead of moved, meaning functions are deleted when queueing an event.
* The `playAudio` method of speakers works much more like it does in-game.
* Loading and dumping bytecode chunks is disabled as expected.
* Seeking on HTTP handles now works properly.

## Vanilla mode
CraftOS-PC provides another compatibility-related configuration option called vanilla mode (`vanilla`). Vanilla mode disables all of the extra features of CraftOS-PC inside CraftOS, making it essentially equivalent to other emulators without these features, such as CCEmuX. This is useful if you want as authentic of a CraftOS experience as possible, even if it means giving up additional functionality.

Here are the things that are removed or disabled in vanilla mode:

* `config` API
* `mounter` API
* `periphemu` API
* Graphics mode functions in `term`
* HTTP server functions, including WebSocket servers
* Debug breakpoints
* Plugin loading (this may come back in the future?)

Vanilla mode and standards mode both function to improve compatibility, but they are two separate things. They have different effects (standards mode focuses on tweaks while vanilla mode focuses on removals), and can be enabled independently of each other (including having both on at the same time). If you desire the most accurate ComputerCraft emulation possible in CraftOS-PC, you can enable both standards mode and vanilla mode, but for most users it is recommended to either enable `standardsMode` only or neither.

### Server mode
Server mode is a lighter version of vanilla mode that only disables functions that may be a vulnerability on shared machines, such as HTTP servers and mounting. Other APIs and functionality are still present.

## Configuration variables for best compatibility
If you are experiencing compatibility issues with programs, these configuration settings may be helpful. Note that these may affect performance or available features.

* `abortTimeout` = 7000 (automatic in standards mode)
* `debug_enable` = true
* `disable_lua51_features` = false
* `http_enable` = true
* `http_max_download` = 16777216
* `http_max_requests` = 16
* `http_max_upload` = 4194304
* `http_max_websockets` = 4
* `http_max_websocket_message` = 131072
* `http_timeout` = 30000
* `http_websocket_enabled` = true
* `maximumFilesOpen` = 128
* `maxNotesPerTick` = 8
* `maxOpenPorts` = 128
* `defaultWidth` = 51
* `defaultHeight` = 19
* `monitorsUseMouseEvents` = false
* `mouse_move_throttle` = -1
* `standardsMode` = true
