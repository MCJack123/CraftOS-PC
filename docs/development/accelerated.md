# CraftOS-PC Accelerated (Deprecated)
CraftOS-PC *Accelerated* is a fork of CraftOS-PC that replaces the standard Lua interpreter with the LuaJIT interpreter. LuaJIT is a special implementation of Lua that compiles Lua scripts directly to machine code, rather than to Lua bytecode. This allows it to run up to 50% faster than standard CraftOS-PC in some scenarios.

## Advantages
* Faster than standard CraftOS-PC
* Support for calling C from Lua via the `ffi` library
* Calling `os.pullEvent()` in a metamethod no longer crashes
  * This also removes the need for a custom `pcall()` function
* Includes some Lua 5.2 features not previously available

## Disadvantages
* More likely for bugs to exist
* May use more memory

## Downloading
CraftOS-PC *Accelerated* can be downloaded from the [GitHub releases](https://github.com/MCJack123/craftos2/releases) page. It can be installed alongside CraftOS-PC if desired. See [Installation](installation) for more details on installing.