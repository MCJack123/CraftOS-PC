# Error Messages
This page details some error messages that may appear when using CraftOS-PC, and how to fix them.

## `An error occurred while opening the computer session`
This error happens when a critical problem occurs when the computer session is being created. Usually this is a problem with the ROM or some other system-level issue. Here are some possible messages that can happen:

| Message | Description | Remedy |
|---------|-------------|--------|
| `Could not mount ROM` | The CraftOS ROM directory is missing. | Make sure the `rom` folder is present in the CraftOS-PC installation directory. If using a custom ROM directory, make sure you're passing in the top-level folder that contains `rom` and `bios.lua`, and not the `rom` folder itself. |
| `Could not mount debugger ROM` | The debugger support files are missing. | This usually occurs when using a custom ROM. Make sure the `debug` folder is present in the installation/ROM directory. If it is missing from a custom ROM, you can copy it from the original ROM. |
| `Could not load per-computer config: ...` | The computer's per-computer configuration file is corrupt. | Back up and delete the `<id>.json` file from the `config` folder in the data directory. |
| `Could not create new terminal` | An error occured while creating the terminal window for the computer. | [See below](#could-not-create-new-terminal) for more info on this error. |

## `Could not create new terminal`
This error can happen when creating anything that has a terminal attached, such as a computer, debugger, or monitor.

| Message | Description | Remedy |
|---------|-------------|--------|
| `Failed to create window` | The computer's terminal window could not be created. | This is a rare issue, but it indicates some system issue that prevents CraftOS-PC from starting. On CraftOS-PC v2.3.1 or later, an extra error message is included that describes the issue better. |
| `Failed to load font` | The font file could not be loaded. | This usually only occurs when using a custom font, including using the HD font. If using the HD font, make sure `hdfont.bmp` is present in the install/ROM directory. If using another custom font, make sure the file exists and is stored in BMP format. The path has to be an absolute path and accessible to the user that is running CraftOS-PC. |
| `Failed to convert font` | The font bitmap could not internally be converted into the correct format. | This error is highly unlikely. On CraftOS-PC v2.3.1 or later, an extra error message is included that describes the issue better. |

## Computer runtime errors
These errors can occur while starting or running a computer.

| Message | Description | Remedy |
|---------|-------------|--------|
| `Couldn't load BIOS` | The BIOS file for the computer couldn't be loaded. This could be caused by a missing `bios.lua` file, or a compilation error in the Lua script. | Make sure `bios.lua` exists in the install/ROM directory and is readable. Also check that there are no errors in the BIOS. If a compilation error occurred, an error message will likely be listed, and that can be used to diagnose the issue. |
| `An unexpected error occurred in a Lua function` | An unprotected Lua error occurred in the BIOS, and the computer could not recover. This can also occur when using a top-level coroutine override (TLCO), at which point any errors are not protected and will cause this error. | Make sure there are no runtime issues in the BIOS initialization sequence. If using a TLCO, make sure there are no errors in the running function. |
| `Computer not responding` | A long-running task has ignored requests to terminate. | You can choose to either force reboot the computer, or you can wait for the computer to respond. If you choose to wait, the error message will be delayed for another 20 seconds before appearing again. |

## Configuration loading errors
These errors occur when there is an error in one (or more) of the configuration JSON files.
| Message | Description | Remedy |
|---------|-------------|--------|
| `An error occurred while parsing the global configuration file` | There is an error in the global config file at `config/global.json`. A description of what went wrong is included. | Check the global config file for errors at the line provided in the error message. If necessary, use a JSON checker website such as https://jsonchecker.com to find the error. |
| `An error occurred while parsing the per-computer configuration file` | There is an error in the per-computer config file at `config/<id>.json`. A description of what went wrong is included. On CraftOS-PC v2.3.5 and later, the computer's ID is also included. | Check the config file for the computer being opened for errors at the line provided in the error message. If necessary, use a JSON checker website such as https://jsonchecker.com to find the error. |

## Peripheral creation errors
These errors can occur when creating a peripheral.

| Message | Peripheral type | Description | Remedy |
|---------|-----------------|-------------|--------|
| `"side" parameter must be in the form of computer_[0-9]+` | Computer | The side parameter when creating the computer does not contain the ID of the computer. | Make sure the side provided is either a string with "computer_" and then a number (indicating the computer ID), or just a number. |
| `Failed to open computer` | Computer | An error occured while creating the computer. An error message describing the issue should have appeared before this. | [See above](#an-error-occurred-while-opening-the-computer-session) for more information. |
| `Could not start debugger session` | Debugger | The debugger computer could not be opened. | [See above](#an-error-occurred-while-opening-the-computer-session) for more information. |
| `Could not create new terminal` | Monitor | The terminal window for the monitor could not be created. | [See above](#could-not-create-new-terminal) for more information. |
| `Monitors are not available in headless mode` | Monitor | A monitor was attached to the computer while in headless mode. | Monitors cannot be created in headless mode. Restart CraftOS-PC with a different renderer to use monitors. |

## Peripheral runtime errors
These errors can occur when calling a method on a peripheral.

| Message | Peripheral method | Description | Remedy |
|---------|-------------------|-------------|--------|
| `Could not mount` | `drive.insertDisk` | The requested directory to mount was not found. | Make sure the path to the directory to mount exists and is readable. |
| `Too many open channels` | `modem.open` | The maximum number of open ports for a modem has been reached. | Close some open ports, or adjust the `maxOpenPorts` config option. |
| `Error printing to PDF` | `printer.endPage` | An error occurred while writing the output. | An additional error message is included to help diagnose the error. |
| `invalid volume`, `invalid pitch`, `invalid speed` | `speaker.playNote`, `speaker.playSound` | The specified value is out of range. | Make sure the  volume is in the range [0.0, 3.0], the pitch is in the range [0, 24], or the speed is in the range (0.0, 2.0]. |

## Plugin errors
These errors can occur when loading incompatible plugins. They appear when starting the computer before the shell loads. Not all of these errors will cause the plugin loading to fail, but are just warnings.

| Message | Stops loading? | Description | Remedy (for plugin maintainers) |
|---------|----------------|-------------|--------|
| `Missing plugin info` | No | The plugin doesn't have any CraftOS-PC metadata. This usually happens when loading a standard Lua module as a plugin. | Add a `plugin_info` function to your plugin as described [in the plugin documentation](plugins). |
| `Invalid plugin info` | No | The plugin info function returned a non-table result. | Make sure `plugin_info` pushes a table onto the stack passed to it with the plugin's metadata. |
| `Old plugin API` | Yes | The plugin was built for an older version of CraftOS-PC. | Update your plugin to use the latest API version as listed [in the documentation](plugins#api-versions). |
| `Missing API opener` | Yes | The plugin is missing the function to load its API, or the plugin file is incorrectly labeled. | Make sure the plugin has not been renamed, and make sure the plugin's loader function is labeled `luaopen_<file>`, where `<file>` is the name of the file sans extension. |