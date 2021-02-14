# Standards Mode
CraftOS-PC attempts to retain as much compatibility as possible with standard ComputerCraft as possible to keep the experience consistent. However, some tweaks are put in place to allow more things to be possible (such as <50ms timers) at the expense of possible compatibility. Standards mode reverses these tweaks, allowing more compatibility if desired.

## Enabling
Standards mode is exposed through the `standardsMode` config option. From the shell, running `config set standardsMode true` will enable standards mode. `config set standardsMode false` will turn it back off. It can also be accessed from the `config` API or `global.json` as usual.

## Changes
These are the behaviors that change when standards mode is enabled.

* The abort timeout (`abortTimeout`) is locked at 7 seconds, and cannot be changed. However, it does not mutate the actual config option.
* Extended margins (`extendMargins`) are enabled, and cannot be disabled. However, it does not mutate the actual config option.
* Timers and alarms are rounded to the nearest 50ms (1 "tick"), and always take at least 50ms to fire (a length of 0 does not fire immediately).
* `os.epoch("ingame")` returns a value rounded to 50ms (1 "tick").
* `fs.getFreeSpace` and `fs.getCapacity` will calculate the actual free space/capacity based on the value of `computerSpaceLimit`. However, this limit is not enforced, and if the space used exceeds `computerSpaceLimit`, `fs.getFreeSpace` returns a negative number.
* Errors no longer show dialog boxes, instead displaying the error on the terminal and suspending execution as expected in ComputerCraft. The window stays on the screen until closed.
* If a computer does not yield for 10 seconds (3 seconds more than the abort timeout), it is hard-stopped, and an error message is displayed as described above.
* Mouse clicks on buttons > 3 (not left/middle/right) are ignored, and no event is sent.
* The `load` function is now resumable (you can call `coroutine.yield` from it); however, this is experimental, and uses threads to make this possible. Expect some performance loss due to this.