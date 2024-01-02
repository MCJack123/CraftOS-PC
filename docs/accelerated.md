# CraftOS-PC Accelerated
CraftOS-PC Accelerated is a fork of CraftOS-PC that replaces the standard Lua interpreter with the LuaJIT interpreter. LuaJIT is a special implementation of Lua that compiles Lua scripts directly to machine code, rather than to Lua bytecode. This allows it to run over 30x faster than standard CraftOS-PC in some scenarios. However, there are various differences in LuaJIT that break compatibility with ComputerCraft. If a program is not functioning correctly in CraftOS-PC Accelerated, please use it in standard CraftOS-PC instead.

## Advantages
* Much faster than standard CraftOS-PC
* Support for calling C from Lua via the `ffi` library

## Disadvantages
* More likely for bugs to exist
* Lacks some features from Cobalt and normal CraftOS-PC
* Compatibility is not guaranteed

## Downloading
CraftOS-PC Accelerated can be downloaded from the [GitHub releases](https://github.com/MCJack123/craftos2/releases) page. It can be installed alongside CraftOS-PC if desired. See [Installation](installation) for more details on installing.