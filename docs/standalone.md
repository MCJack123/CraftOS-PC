# Standalone Executable
CraftOS-PC v2.3 adds a standalone executable download option to avoid having to install CraftOS-PC to disk. It includes the entire ROM as well as all libraries inside the executable file itself. Because the ROM is self-contained, this means that some features that use the ROM directory are not available. This includes:
* Plugins
  * `--plugin` flag DOES NOT work since plugin loading is entirely disabled
    * This may change in the future
* Custom sounds
* HD font
* ROM customization
  * `romReadOnly` does not affect read-only status of ROM
  * `--rom` flag still works as expected

Standalone executables are not built separately for Mac since the application already doesn't require installation.