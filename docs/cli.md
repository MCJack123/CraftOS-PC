# Command-Line Flags
CraftOS-PC features various command-line flags to toggle certain features or to configure the environment.

## Renderers
Various flags are available to select different renderers for CraftOS-PC. These are listed [on their own page](renderers). You can use the `-r` argument with no options to list the available renderers.

## Custom script
The `--script` flag can be used to set a custom startup script to run before any other startup scripts that may be on the computer. This is mainly useful in conjunction with headless mode. You can also use the `--exec` flag to run an inline string of code from the command line instead of from a file. Arguments can be passed to the script using the `--args` option. All arguments to the script must be contained within one string on the command line, so wrap multiple arguments in quotes.

## Custom data/ROM directory & ID
The `--directory` option can be passed to CraftOS-PC to change the path of the save data to somewhere other than the default location in your user directory. `--rom` does the same thing, but for the ROM directory (the folder that contains `rom` and `bios.lua`). The `--mc-save` flag can also be used to use the computer directory in the specified Minecraft save (assuming the standard Minecraft install directory). The `--id` option changes the ID of the first computer that will open (note that this overrides the `initialComputer` config argument), so `--id 5` will open computer #5 instead of #0.

## Mount injection
Directories can be injected as mounts into CraftOS-PC straight from the command line. These mounts will be added before each computer starts up. There are three ways to specify mounts. Each of these flags should be followed by an argument of the format `<path>=<directory>`, where `<path>` is the destination path inside the computer, and `<directory>` is the path to the directory to mount.
* `--mount` will mount the path with whatever `mount_mode` is selected in the config.
* `--mount-rw` will force the mount to be read-write.
* `--mount-ro` will force the mount to be read-only.

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
