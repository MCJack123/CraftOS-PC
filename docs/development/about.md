# What is CraftOS-PC?
CraftOS-PC is a fast and resource-light emulator for ComputerCraft 1.8 that adds many new features to CraftOS. It's built entirely with C++, allowing it to ditch the Java VM that other emulators use, reducing resource use while improving processing speed.

It supports many of the peripherals available in ComputerCraft, including monitors, printers, disk drives, modems, and more. You can connect and disconnect peripherals using the attach and detach commands from the shell. The `periphemu` API can also be used to manipulate peripherals from Lua. In addition, the mount and unmount commands and the `mounter` API allow mounting real directories inside the CraftOS environment.

CraftOS-PC can run multiple emulated computers that are completely separated from each other. Each computer gets its own filesystem and local configuration using an ID number, just like ComputerCraft. Computers can be created and attached just like any other peripheral, using either the attach command or the `periphemu` API.

CraftOS-PC introduces a new graphics mode that allows bitmapped pixel access to the terminal with up to 256 colors available to use. When in graphics mode, the screen has a resolution 6 times wider and 9 times taller than the text size of the terminal. This allows a base resolution of 306x171 pixels on a standard sized terminal.

CraftOS-PC includes a built-in screenshot and GIF recording tool. No longer do you need to open Snipping Tool or use recgif; CraftOS-PC can do it for you. You can press F2 to take a screenshot or F3 to toggle GIF recording, which will be saved to .craftos/screenshots in your home directory. GIFs are restricted to a maximum length of 15 seconds to save memory usage.

CraftOS-PC allows you to configure every part of the ComputerCraft experience. The config command and API allow access to the configuration directly from inside CraftOS. The configuration is stored as plain JSON in `~/.craftos/config`, so it's easily editable even outside the ComputerCraft environment.

CraftOS-PC features a plugin API, allowing extending the functionality of CraftOS through the use of C++ code. One example of a plugin available is a compatibility layer for CCEmuX: it emulates the `ccemux` API, allowing programs designed for it to work with CraftOS-PC. It may also be possible for some C Lua libraries to work with CraftOS-PC.