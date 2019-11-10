# Peripheral Emulation
CraftOS-PC features a robust peripheral emulation system. It can emulate many peripherals available in ComputerCraft, making them available through the `peripheral` API. Peripherals can be attached to a computer either from the shell or in Lua.

Here are the peripherals currently available in CraftOS-PC:
* drive
* modem
* monitor
* printer
* [computer](multicomp.html)

## From the shell
To attach a peripheral from the shell, you can use the "attach" command. It takes two arguments: the side or ID of the peripheral (`left`, `1`, `monitor_4`), and the type of peripheral to attach. (Some peripherals, such as drive, support a third argument; these are described later.) The peripheral will then be attached to the computer. It can then be used with any program that uses peripherals, such as the "monitor" command.  

Peripherals can be detached using the "detach" command. This takes just one argument: the side/ID of the peripheral to detach. The peripheral will then be removed from the computer.

## From Lua
The `periphemu` API provides low-level access to the peripheral emulation layer. The `periphemu.create(side, type[, path])` function attaches a peripheral to the computer. It returns a boolean telling whether the peripheral was successfully attached. Peripherals can be detached with `periphemu.remove(side)`, which also returns a boolean saying whether the peripheral was able to be removed.

## Special peripherals
Some peripherals have special options that can be specified as the third argument to "attach" or `periphemu.create`.
* drive peripherals accept a third argument that sets the initial mounted path in the drive. This can be either a global path to a folder or audio file, a number specifying a disk ID, or a treasure path in the form `treasure:<path>`.
  * There is a new method on the drive called `insertDisk` that allows you to change the mount without reattaching the peripheral. This method is also exported through the `disk` API.
* printer peripherals require a third argument specifying where the printed output will be stored. This should be a full path to a PDF file (if using a build supporting PDF) or a directory.