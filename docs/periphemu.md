# Peripheral Emulation
CraftOS-PC features a robust peripheral emulation system. It can emulate many peripherals available in ComputerCraft, making them available through the `peripheral` API. Peripherals can be attached to a computer either from the shell or in Lua.

Here are the peripherals currently available in CraftOS-PC:
* [drive](https://tweaked.cc/peripheral/drive.html)
* [modem](https://tweaked.cc/peripheral/modem.html)
* [monitor](https://tweaked.cc/peripheral/monitor.html)
* [printer](https://tweaked.cc/peripheral/printer.html)
* [speaker](https://tweaked.cc/peripheral/speaker.html)
* [computer](multicomp)
* [debugger](debugger)
* [debug_adapter](debugger#debug-adapter-vs-code)
* chest/minecraft:chest (implements [inventory](https://tweaked.cc/generic_peripheral/inventory.html) peripherals)
* energy (implements [energy_storage](https://tweaked.cc/generic_peripheral/energy_storage.html) peripherals)
* tank (implements [fluid_storage](https://tweaked.cc/generic_peripheral/fluid_storage.html) peripherals)

## From the shell
To attach a peripheral from the shell, you can use the "attach" command. It takes two arguments: the side or ID of the peripheral (`left`, `1`, `monitor_4`), and the type of peripheral to attach. (Some peripherals, such as drive, support a third argument; these are described later.) The peripheral will then be attached to the computer. It can then be used with any program that uses peripherals, such as the "monitor" command.  

Peripherals can be detached using the "detach" command. This takes just one argument: the side/ID of the peripheral to detach. The peripheral will then be removed from the computer.

## From Lua
The `periphemu` API provides low-level access to the peripheral emulation layer. The `periphemu.create(side, type[, path])` function attaches a peripheral to the computer. It returns a boolean telling whether the peripheral was successfully attached. Peripherals can be detached with `periphemu.remove(side)`, which also returns a boolean saying whether the peripheral was able to be removed.

### Functions
* *boolean* `periphemu.create`(*string* side, *string* type\[, *string* path\]): Creates a new peripheral.
  * side: The side of the new peripheral
  * type: One of the supported peripheral types
  * path: If creating a printer, the local path to the output file
  * Returns: `true` on success, `false` on failure (already exists)
* *boolean* `periphemu.remove`(*string* side): Removes a peripheral.
  * side: The side to remove
  * Returns: `true` on success, `false` on failure (already removed)
* *table* `periphemu.names`(): Returns a list of available peripheral types.

## Special peripherals
Some peripherals have special options that can be specified as the third argument to "attach" or `periphemu.create`.
* drive peripherals accept a third argument that sets the initial mounted path in the drive. This can be either a global path to a folder or audio file, a number specifying a disk ID, or a namespaced ID in the form `<type>:<path>`.
  * These are the available namespaces as of v2.5.2:
    * `treasure:<path>`
    * `record:<name>`
    * `computer:<id>`
  * There is a new method on the drive called `insertDisk` that allows you to change the mount without reattaching the peripheral. This method is also exported through the `disk` API.
* printer peripherals require a third argument specifying where the printed output will be stored. This should be the full (real) path to the target PDF file, or a directory if using a custom build without PDF support.
* modem peripherals accept a third argument that sets the network ID for the modem. This allows having multiple modem networks running parallel to each other without being able to communicate with each other.
* chest peripherals accept a third argument specifying whether they emulate a double (`true`) or single (`false`) chest.
* energy peripherals can take a third argument specifying the maximum energy count, and a fourth argument with a list of additional types to add to the peripheral.
* tank peripherals can take a third argument specifying the number of tanks, a fourth argument specifying the size of each tank, and a fifth argument with a list of additional types to add to the peripheral.

### Speaker sounds
The speaker peripheral comes with some open-source sounds for use with the `playNote` function. It does not have any sounds that are available from the `playSound` function, but these can easily be added in from a resource pack or your own copy of Minecraft. Sound packs can be placed in the `sounds/` directory in the installation directory, next to `rom` and `bios.lua`. These use the same format as Minecraft resource packs, and must contain [a sounds.json file](https://minecraft.gamepedia.com/Sounds.json), and a folder named `sounds` that contains the actual sound files.

To add in Minecraft sounds from an assets directory, you must deobfuscate the object files. You can use [this Python tool](https://gist.github.com/MCJack123/6c543125e7724645f78c72d4ae918558) that I wrote to convert the objects into the required format. It expects the path to your assets directory (`.minecraft/assets`), the `major.minor` version number to extract (`1.15`), and the output directory to write to. After extracting, copy `sounds.json` and `sounds/` from the resources to `sounds/minecraft/` in the ROM directory. Once this is done, all Minecraft sounds will be available to use in `playSound`. The default note sounds will also be replaced with the official Minecraft sounds.

### Speaker `playAudio` emulation differences
CraftOS-PC implements the `playAudio` method on speakers a bit differently from CC:T. In CraftOS-PC, all audio is stored in a queue, and queueing audio never fails. This audio is played back immediately, and the `speaker_audio_empty` event is queued as soon as playback finishes. Because of this, some programs that expect `playAudio` to fail when full may run faster than expected. The behavior of CC:T can be restored by enabling [standards mode](standards).

### Additional functions for certain peripherals

#### `speaker`
* *table* `speaker.listSounds`(): Returns a hierarchical list of all sounds available to `playSound`.
* *nil* `speaker.playLocalMusic`(*string* path[, *number* volume]): Plays a local music file.
  * path: The path to the music file
  * volume: The volume of the music, from 0.0 to 3.0.
* *nil* `speaker.setSoundFont`(*string* path): Sets the path to the active soundfont, if supported. (Experimental)
  * path: The path to the SF2 file

#### `drive`
* *nil* `drive.insertDisk`(*string/number* path): Replaces the loaded disk with the specified resource.
  * path: Either a disk ID or path to load
	* If number: Mounts the floppy disk (`<save dir>/computer/disk/<id>`) to /disk[n]
	* If path to directory: Mounts the real path specified to /disk[n]
	* If path to file: Loads the file as an audio disc (use `disk.playAudio` or the "dj" command)
  * `record:<name>`: Mounts the specified music disk from the speaker sounds
  * `treasure:<author>/<name>`: Mounts a treasure disk. Treasure disks can be placed in `treasure` in the CraftOS-PC ROM directory.

#### `chest`
* *number* `chest.setItem`(*number* slot, *table* item): Assigns an item to the specified slot.
  * slot: The slot to modify
  * item: A table with an `item` field (string) and a `count` field (number), specifying the item name and count
  * Returns: The number of items actually added

#### `energy`
* *nil* `energy.setEnergy`(*number* energy): Sets the amount of energy in the peripheral.
  * energy: The energy level, between 0 and `energy.getMaxEnergy()`

#### `tank`
* *number* `tank.addFluid`(*string* name, *number* amount): Adds an amount of fluid to the tank.
  * name: The name of the fluid to add
  * amount: The amount of fluid to add
  * Returns: The amount of fluid actually added
* *table* `tank.removeFluid`([*string* name[, *number* amount]]): Removes the specified fluid from the tank.
  * name: The name of the fluid to remove, or `nil`/`""` to remove all fluids
  * amount: The amount of fluid to remove, defaults to the maximum possible
  * Returns: A list of fluids actually removed, with each entry being a table with `name` and `amount` fields