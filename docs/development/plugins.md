# Plugin System
CraftOS-PC features a new plugin system that allows importing external Lua libraries into the ComputerCraft environment. Many pre-existing Lua libraries work out of the box, including some LuaRocks. A CCEmuX adapter plugin is avaiable with all binary versions of CraftOS-PC v2.2 and later.

## Installing
Plugins can be installed in these locations depending on your platform:
* Windows: `C:\Program Files\CraftOS-PC\plugins`
* macOS: `CraftOS-PC.app/Contents/PlugIns`
* Linux: `/usr/share/craftos/plugins`

The plugin file **must** have the name that the library's `luaopen_` function uses. For example, the CCEmuX plugin must be named `ccemux` because the loader function is named `luaopen_ccemux`. Once a plugin is installed it will be available in the global table with the same name as the plugin file.

## Using Lua libraries
CraftOS-PC can automatically import Lua libraries as they would be used with standard Lua. Even though CraftOS-PC uses its own version of Lua, you can still use libraries that were built for standard Lua 5.1.

To use a Lua library with CraftOS-PC, simply drop the DLL/dylib/so file into the `plugins` folder as listed above, and rename it so it starts with `lua_` (e.g. `lua_zlib.dll`). This will tell CraftOS-PC not to search for plugin metadata, and instead treats it like a standard library. Make sure to keep the rest of the file name the same, as this is what CraftOS-PC uses to determine the library's name.

## Writing plugins
A plugin for CraftOS-PC follows the same format as a normal Lua library, with an additional function providing metadata about the plugin. It contains a C function named `luaopen_<name>` that takes one `lua_State*` argument. This function should return a table with the contents of the new API to add. It should also contain a function named `plugin_info`, which takes a `lua_State*` as well. This function should push a table containing a `version` key with the plugin API version, as well as the required capabilities as callback functions. See the table at the bottom of the page for the API versions.  
These are the available capabilities as of CraftOS-PC v2.3.4:
* `register_getLibrary`: Recieves the address of the `library_t * getLibrary(std::string name)` function
    * This function allows accessing the functions for built-in APIs without going through Lua
* `register_registerPeripheral`: Recieves the address of the `void registerPeripheral(std::string name, peripheral_init initializer)` function
    * This function adds a peripheral class to the list of available peripherals
* `register_addMount`: Recieves the address of the `bool addMount(Computer * comp, const char * real_path, const char * comp_path, bool read_only)` function
    * This function mounts a path inside the computer, similar to `mounter.mount()`
* `register_termQueueProvider`: Recieves the address of the `void termQueueProvider(Computer *comp, const char *(*callback)(lua_State*, void*), void* data)` function
    * This function queues an event that has its data filled in by the callback
* `register_startComputer`: Receives the address of the `Computer* startComputer(int id)` function
    * This function starts a computer on a new thread and returns the new Computer object
* `register_queueTask`: Receives the address of the `void* queueTask(std::function<void*(void*)> func, void* userdata, bool async)` function
    * This function runs a function on the main thread with an optional opaque pointer argument, and unless `async` is `true`, returns an opaque pointer returned by the function
* `register_getComputerById`: Receives the address of the `Computer * getComputerById(int id)` function
    * This function returns a Computer object associated with an ID
* `get_selectedRenderer`: Receives an integer specifying the current renderer

As of CraftOS-PC v2.3.2, capability callbacks get the name of the capability that's being registered pushed on the stack, so you can now have one function that handles all capabilities required, checking the value of the string passed.

If compiling for Windows, make sure to use the `_declspec(dllexport)` macro. (The `LUA_API` macro does this for you.) The plugin must be compiled as a dynamic library (and/or bundle on Mac) for the given platform. To see an example of a plugin, see `examples/ccemux.cpp` in the source.

#### API versions
| API Version | CraftOS-PC Version |
|-------------|--------------------|
| (none)      | v2.0 - v2.1.3      |
| 2           | v2.2 - v2.3.4      |
| 3           | Accelerated v2.2   |
| 4           | v2.4 - Current     |