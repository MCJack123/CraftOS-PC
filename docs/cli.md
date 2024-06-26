# Command-Line Flags
CraftOS-PC features various command-line flags to toggle certain features or to configure the environment.

## Renderers
Various flags are available to select different renderers for CraftOS-PC. These are listed [on their own page](renderers). You can use the `-r` argument with no options to list the available renderers. In addition, the `--single` flag will tell the renderer to use a single window instead of making multiple. (This is always enabled in CLI mode.)

## Custom script
The `--script` flag can be used to set a custom startup script to run before any other startup scripts that may be on the computer. This is mainly useful in conjunction with headless mode. You can also use the `--exec` flag to run an inline string of code from the command line instead of from a file. Arguments can be passed to the script using the `--args` option. All arguments to the script must be contained within one string on the command line, so wrap multiple arguments in quotes.

## Custom data/ROM directory & ID
The `--directory` option can be passed to CraftOS-PC to change the path of the save data to somewhere other than the default location in your user directory. The `--mc-save` flag can also be used to use the computer directory in the specified Minecraft save (assuming the standard Minecraft install directory). The `--id` option changes the ID of the first computer that will open (note that this overrides the `initialComputer` config argument), so `--id 5` will open computer #5 instead of #0.

`--rom` sets the path to the ROM directory to use. To set up a custom ROM path, the directory must contain at least `bios.lua` and a `rom/` directory (these can contain any contents, but must be named exactly). In addition, the following extra files are required from the default ROM depending on the configuration:
* `hdfont.bmp` is required if the HD font is enabled
* `debug/` is required if using the debugger

## Mount injection
Directories can be injected as mounts into CraftOS-PC straight from the command line. These mounts will be added before each computer starts up. There are three ways to specify mounts. Each of these flags should be followed by an argument of the format `<path>=<directory>`, where `<path>` is the destination path inside the computer, and `<directory>` is the path to the directory to mount.
* `--mount` will mount the path with whatever `mount_mode` is selected in the config.
* `--mount-rw` will force the mount to be read-write.
* `--mount-ro` will force the mount to be read-only.

## Raw mode clients & WebSockets
CraftOS-PC has the ability to not only serve [raw mode](rawmode) connections, but also be a client for them. To connect to a raw mode session over terminal I/O, use the `--raw-client` flag. This can be combined with different rendering options, but do note that only GUI renderers can be used in this mode. Be aware that a single pipe between commands is not enough to make this work; a two-way pipe will be necessary. On the Linux command line, using `mkfifo temp.fifo`, then `craftos --raw < temp.fifo | craftos --raw-client > temp.fifo` will work.

In addition to terminal I/O, CraftOS-PC can connect to WebSocket servers. This includes [remote.craftos-pc.cc](remote), even though it's designed for VS Code. To connect to a WebSocket, pass the `--raw-websocket` flag with the URL of the WebSocket to connect to. This works the same way as `--raw-client`, but does not use the terminal.

## CCEmuX compatibility flags
CraftOS-PC v2.3.4 adds a number of new flags to make it a snap-in replacement for any tools that may use CCEmuX flags. These flags include:
* `-a|--assets-dir <dir>`:            Sets the CC:T directory that holds the ROM & BIOS (must contain an `assets/computercraft/lua` folder inside)
* `-C|--computers-dir <dir>`:         Sets the directory that stores data for each computer
* `-c=|--start-dir <dir>`:            Sets the directory that holds the startup computer's files
* `-d|--data-dir <dir>`:              Sets the directory that stores user data
* `--plugin <file>`:                  Adds an additional plugin to the load list
* `-r|--renderer [renderer]`:         Lists all available renderers, or selects the renderer

With these arguments, you can seamlessly replace `java -jar ccemux-launcher.jar` in any script with `craftos`.

In addition, you can use `--migrate` to trigger CCEmuX migration, even if data is already present.

## Help & version
If you want to see an overview of the available options for your version of CraftOS-PC, you can use the `-h` flag to show the help. You can also view the version information as well as compiled features with the `-V` flag.
