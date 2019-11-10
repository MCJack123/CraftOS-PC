# Plugin System
CraftOS-PC features a new plugin system that allows importing external Lua libraries into the ComputerCraft environment. Many pre-existing Lua libraries work out of the box, including some LuaRocks. A CCEmuX adapter plugin is avaiable on the GitHub repo.

## Installing
Plugins can be installed in these locations depening on your platform:
* Windows: `C:\Program Files\CraftOS-PC\plugins`
* macOS: `CraftOS-PC.app/Contents/PlugIns`
* Linux: `/usr/share/craftos/plugins`

The plugin file **must** have the name that the library's `luaopen_` function uses. For example, the CCEmuX plugin must be named `ccemux` because the loader function is named `luaopen_ccemux`. Once a plugin is installed it will be available in the global table with the same name as the plugin file.

## Writing plugins
A plugin for CraftOS-PC follows the same format as a normal Lua library. It contains a C function named `luaopen_<name>` that takes one `lua_State*` argument. This function should return a table with the contents of the new API to add. If compiling for windows, make sure to use the `_declspec(dllexport)` macro. (The `LUA_API` macro does this for you.) The plugin must be compiled as a dynamic library for the given platform. To see an example of a plugin, see `examples/ccemux.cpp` for more info.