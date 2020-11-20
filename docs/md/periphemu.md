# Peripheral Emulation
CraftOS-PC features a robust peripheral emulation system. It can emulate many peripherals available in ComputerCraft, making them available through the `peripheral` API. Peripherals can be attached to a computer either from the shell or in Lua.

Here are the peripherals currently available in CraftOS-PC:
* drive
* modem
* monitor
* printer
* speaker
* [computer](multicomp)
* [debugger](debugger)

## From the shell
To attach a peripheral from the shell, you can use the "attach" command. It takes two arguments: the side or ID of the peripheral (`left`, `1`, `monitor_4`), and the type of peripheral to attach. (Some peripherals, such as drive, support a third argument; these are described later.) The peripheral will then be attached to the computer. It can then be used with any program that uses peripherals, such as the "monitor" command.  

Peripherals can be detached using the "detach" command. This takes just one argument: the side/ID of the peripheral to detach. The peripheral will then be removed from the computer.

## From Lua
The `periphemu` API provides low-level access to the peripheral emulation layer. The `periphemu.create(side, type[, path])` function attaches a peripheral to the computer. It returns a boolean telling whether the peripheral was successfully attached. Peripherals can be detached with `periphemu.remove(side)`, which also returns a boolean saying whether the peripheral was able to be removed.

## Special peripherals
Some peripherals have special options that can be specified as the third argument to "attach" or `periphemu.create`.
* drive peripherals accept a third argument that sets the initial mounted path in the drive. This can be either a global path to a folder or audio file, a number specifying a disk ID, or a treasure path in the form `treasure:<path>`.
  * There is a new method on the drive called `insertDisk` that allows you to change the mount without reattaching the peripheral. This method is also exported through the `disk` API.
* printer peripherals require a third argument specifying where the printed output will be stored. This should be the full (real) path to the target PDF file, or a directory if using a custom build without PDF support.
* modem peripherals accept a third argument that sets the network ID for the modem. This allows having multiple modem networks running parallel to each other without being able to communicate with each other.

### Speaker sounds
The speaker peripheral comes with some open-source sounds for use with the `playNote` function. It does not have any sounds that are available from the `playSound` function, but these can easily be added in from a resource pack or your own copy of Minecraft. Sound packs can be placed in the `sounds/` directory in the installation directory, next to `rom` and `bios.lua`. These use the same format as Minecraft resource packs, and must contain [a sounds.json file](https://minecraft.gamepedia.com/Sounds.json), and a folder named `sounds` that contains the actual sound files.

To add in Minecraft sounds from an assets directory, you must deobfuscate the object files. You can use [this Python tool](https://gist.github.com/MCJack123/6c543125e7724645f78c72d4ae918558) that I wrote to convert the objects into the required format. It expects the path to your assets directory (`.minecraft/assets`), the `major.minor` version number to extract (`1.15`), and the output directory to write to. After extracting, copy `sounds.json` and `sounds/` from the resources to `sounds/minecraft/` in the ROM directory. Once this is done, all Minecraft sounds will be available to use in `playSound`. The default note sounds will also be replaced with the official Minecraft sounds.