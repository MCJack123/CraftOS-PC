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

## Custom script
The `--script` flag can be used to set a custom startup script to use instead of `startup.lua`. This is mainly useful in conjunction with headless mode.