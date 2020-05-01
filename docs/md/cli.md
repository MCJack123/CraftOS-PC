# CLI Mode & Flags
CraftOS-PC v2.1 adds a new command line interface that uses ncurses to render the ComputerCraft terminal. Earlier versions also feature a headless mode that displays text through the standard output (though it doesn't support input).

## CLI mode
*CLI mode is not supported on Windows.*
The command-line interface to CraftOS-PC can be activated by passing the `--cli` option to the program. When in CLI mode, the CraftOS shell appears in the terminal instead of as a new window/application. This is what CLI mode looks like on Mac:

![CLI mode](../images/cli.png)

In CLI mode, only one window (computer or monitor) can be viewed at a time. Windows can be cycled using Shift+Left/Right Arrow.

Please note that a few features are missing in CLI mode. First, modifier keys (such as Ctrl) are not detected in CLI mode; instead, pressing Home and End (fn+Left and fn+Right on Mac) will send Ctrl and Alt, respectively. To actually type Home or End, hold down shift while pressing these keys. Also, graphics mode is not available in CLI mode. Finally, the character set available in CLI mode is much different from the ComputerCraft character set, so some programs using custom characters will not display correctly.

## Headless mode
CraftOS-PC also has a lesser-featured headless mode that can display simple text output. It's designed to be able to run scripts in a CraftOS environment without the overhead of an interface. One use is for CI testing: when CI runs, it starts CraftOS-PC in headless mode using the `--script` argument (see below) to run a test suite. When in headless mode, an extra function is available in the OS API, `os.exit(code)`, which quits CraftOS-PC and returns the exit code provided. CraftOS-PC will start in headless mode when the `--headless` argument is passed on the command line.

## Raw mode
Raw mode allows storing or transporting a CraftOS-PC terminal session in a portable method, including use in a web client. See [the documentation page](rawmode) for more info.

## TRoR mode
Passing `--tror` to CraftOS-PC will enable the TRoR renderer. TRoR is a standard for ComputerCraft that allows sending terminal commands over Rednet. This reads and writes the TRoR packets through standard I/O. CraftOS-PC uses the metadata field to specify the terminal ID of the packet. See [the CraftOS Standard page](https://github.com/oeed/CraftOS-Standards/blob/master/standards/10-tror.md) for more info on the TRoR format.

## Custom script
The `--script` flag can be used to set a custom startup script to run before any other startup scripts that may be on the computer. This is mainly useful in conjunction with headless mode. Arguments can also be passed to the script using the `--args` option. All arguments to the script must be contained within one string on the command line, so wrap multiple arguments in quotes.

## Custom data/ROM directory & ID
The `--directory` option can be passed to CraftOS-PC to change the path of the save data to somewhere other than the default location in your user directory. `--rom` does the same thing, but for the ROM directory (the folder that contains `rom` and `bios.lua`). The `--id` option changes the ID of the first computer that will open (note that this overrides the `initialComputer` config argument), so `--id 5` will open computer #5 instead of #0.