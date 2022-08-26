# Plugin System
CraftOS-PC features a new plugin system that allows importing external Lua libraries into the ComputerCraft environment. Many pre-existing Lua libraries work out of the box, including some LuaRocks. A CCEmuX adapter plugin is avaiable with all binary versions of CraftOS-PC v2.2 and later.

## Installing
Plugins can be installed in these locations depending on your platform:
* Windows: `C:\Program Files\CraftOS-PC\plugins`
* macOS: `CraftOS-PC.app/Contents/PlugIns`
* Linux: `/usr/share/craftos/plugins`

The plugin file should have the name that the library's `luaopen_` function uses. For example, the CCEmuX plugin should be named `ccemux` because the loader function is named `luaopen_ccemux`. For some plugins (such as Lua libraries), this is required, but most plugins designed for CraftOS-PC (like the CCEmuX plugin) will tell CraftOS-PC what name to use automatically. Once a plugin is installed it will be available as a global API with the same name as the plugin.

## Using Lua libraries
CraftOS-PC can automatically import Lua libraries as they would be used with standard Lua. Even though CraftOS-PC uses its own version of Lua, you can still use libraries that were built for standard Lua 5.1.

To use a Lua library with CraftOS-PC, simply drop the DLL/dylib/so file into the `plugins` folder as listed above, and rename it so it starts with `lua_` (e.g. `lua_zlib.dll`). This will tell CraftOS-PC not to search for plugin metadata, and instead treats it like a standard library. Make sure to keep the rest of the file name the same, as this is what CraftOS-PC uses to determine the library's name.

## Writing plugins
A plugin consists of three main functions: `plugin_init`, `luaopen`, and `plugin_deinit`. `plugin_init` is called on the main thread when CraftOS-PC starts up, before any computers are started. It receives a pointer to a `PluginFunctions` structure (see below), and the path to the library as a `path_t` reference. It returns a pointer to a `PluginInfo` structure with the plugin's information filled in. This pointer can either be a static reference, or a dynamically allocated pointer (make sure to deallocate it in `plugin_deinit`, though).

The signature for `plugin_init` is:
```c++
PluginInfo * plugin_init(const PluginFunctions * func, const path_t& path);
```

`luaopen` is the main opener function that is used to initialize the API. It's called on the computer thread every time a computer boots up (this may be after a reboot!). It is a standard C Lua function, and is called in the same way as a normal Lua library opener. It takes one string - the API name - on the stack, and returns a value with which to set the API global to. The function should be named `luaopen_<name>`, where `<name>` is the name of the API. `<name>` is normally inferred from the plugin file's name, but if `PluginInfo.apiName` or `PluginInfo.luaopenName` is set, it will use that field instead.

`plugin_deinit` is called on the main thread before CraftOS-PC quits. It can also be called immediately after `plugin_init` if an error was returned (however, it's not called if an exception is thrown). It takes the pointer returned from `plugin_init`, and returns nothing. `plugin_deinit` is not required for a plugin to work, but it can be used if you need to free resources or to delete a dynamically allocated `PluginInfo` structure.

The signature for `plugin_deinit` is:
```c++
void plugin_deinit(PluginInfo * info);
```

All of these functions should be declared as exported C functions. This means they should be inside an `extern "C"` block, and on Windows have the `__declspec(dllexport)` qualifier. The CraftOS-PC header defines the `DLLEXPORT` macro to take care of `__declspec` for you. Examples of plugins, as well as some starter files, are contained inside the [`examples` directory](https://github.com/MCJack123/craftos2/tree/master/examples) of the CraftOS-PC repository.

The main plugin structures are documented below. However, note that this information is not always up-to-date. It is recommended that you [read through the header directly](https://github.com/MCJack123/craftos2/blob/master/api/CraftOS-PC.hpp) for the latest information.

## `PluginFunctions` structure

The [PluginFunctions](#PluginFunctions-structure) structure is used to hold all of the functions that a plugin may use to interact with CraftOS-PC. This structure is passed (as a constant pointer) to the `plugin_init` function.

There are two different version fields in this structure. The first, abi_version, is used to determine the version of the ABI. Changes to this version indicate a fundamental incompatibility, and you should not continue loading if this version doesn't match the expected version.

The second field, structure_version, is used to determine what functions are exported in both the Computer and [PluginFunctions](#PluginFunctions-structure) structure. This version is bumped when new fields are added to one of the structure definitions. Check this field before using any fields added after structure version 0. It is not required that this field exactly match - as long as the version is greater than or equal to the minimum that your plugin requires to function, you may continue loading.

Do NOT rely on any non-version-0 fields to exist without checking the structure version. If you do this, users using your plugin on an old version of CraftOS-PC will likely experience a segmentation fault/crash when the plugin attempts to load the non-existing function. Instead, you should check that the structure version is compatible, and warn or error that the plugin is incompatible with the current version (without crashing).

Do note that if your plugin doesn't require any CraftOS-PC structures during initialization, you can let CraftOS-PC handle version checks by returning an info structure with the required versions filled in (see below). If the version numbers don't match, CraftOS-PC will stop loading your plugin. However, this will not suffice if you need to access the structures in your plugin_init.

You may see references to version numbers in the form xx.yy - this is a shorthand form to represent &lt;abi_version&gt;.&lt;structure_version&gt;.

### `unsigned `[`abi_version`](#PluginFunctions-structure_1a61ac125a53618993d473713b3d37168c) 

The plugin ABI version that is supported by this copy of CraftOS-PC. This version must **exactly** match your plugin's API version. You should check this version before doing anything else.

### `unsigned `[`structure_version`](#PluginFunctions-structure_1a642cbd6d9e65d0848a9588d9b27c3e92) 

The version of the [PluginFunctions](#PluginFunctions-structure), Computer, and configuration structures. Check this version before using any field that isn't available in version 0. This version must be equal to or greater than your plugin's minimum structure version.

### `const int & `[`selectedRenderer`](#PluginFunctions-structure_1a6bd60b791eab332bddf66072295d2e30) 

A reference to the variable holding the current renderer.

### `const configuration * `[`config`](#PluginFunctions-structure_1a592469bb6f36ea90d4ab0dfb3b42f09b) 

A pointer to the global configuration.

### `path_t `[`getBasePath`](#PluginFunctions-structure_1a16afb7bcc19cab5f4dd31b9968d8f93e)`()` 

Returns the path to the CraftOS-PC data root. 
#### Returns
The path to the CraftOS-PC data root.

### `path_t `[`getROMPath`](#PluginFunctions-structure_1a53440f1d9485199d09e5c25abab7c023)`()` 

Returns the path to the ROM. 
#### Returns
The path to the ROM.

### `library_t * `[`getLibrary`](#PluginFunctions-structure_1a2011d725f15773836d3fb5a89169c74b)`(const std::string & name)` 

Returns the library structure for a built-in API. 
#### Parameters
* `name` The name of the API to get 

#### Returns
A pointer to the library structure for the selected API

### `Computer * `[`getComputerById`](#PluginFunctions-structure_1acbfe48f6bc49593a0e310e9d566a1a1a)`(int id)` 

Returns the computer object for a specific ID. 
#### Parameters
* `id` The ID of the computer to get 

#### Returns
The computer object, or NULL if a computer with that ID isn't running

### `void `[`registerPeripheral`](#PluginFunctions-structure_1a4f7f53efa9a0e2cece1653a7b1c40c32)`(const std::string & name,const peripheral_init & initializer)` 

Registers a peripheral with the specified name. 
#### Parameters
* `name` The name of the peripheral to register. 

* `initializer` The initialization function that creates the peripheral object. 

**See also**: peripheral_init The prototype for a peripheral initializer

### `void `[`registerSDLEvent`](#PluginFunctions-structure_1a079cfe0595636a5957bf3e21f0bc37b3)`(SDL_EventType type,const sdl_event_handler & handler,void * userdata)` 

Registers an SDL event hook to call a function when the specified event occurs. 
#### Parameters
* `type` The type of event to listen for 

* `handler` The function to call when the event occurs 

* `userdata` An opaque pointer to pass to the handler function 

**See also**: sdl_event_handler The prototype for an event handler

### `bool `[`addMount`](#PluginFunctions-structure_1ad34908af3ba21ac4c81925083cc65577)`(Computer * comp,const path_t & real_path,const char * comp_path,bool read_only)` 

Adds a directory mount to a computer. 
#### Parameters
* `comp` The computer to mount on 

* `real_path` The path to the directory to mount 

* `comp_path` The path inside the computer to mount on 

* `read_only` Whether the mount should be read-only 

#### Returns
Whether the mount succeeded

### `bool `[`addVirtualMount`](#PluginFunctions-structure_1ac6508a2f47e45526eba9bb8a838434b8)`(Computer * comp,const FileEntry & vfs,const char * comp_path)` 

Adds a virtual mount to a computer. 
#### Parameters
* `comp` The computer to mount on 

* `vfs` The virtual filesystem file entry to mount 

* `comp_path` The path inside the computer to mount on 

#### Returns
Whether the mount succeeded

### `Computer * `[`startComputer`](#PluginFunctions-structure_1ab9d44e8115b10e6a56da5ceee8b28087)`(int id)` 

Starts up a computer with the specified ID. 
#### Parameters
* `id` The ID of the computer to start 

#### Returns
The Computer object for the new computer

### `void `[`queueEvent`](#PluginFunctions-structure_1a11293a24a4c0b7e9056a5e15194e2af7)`(Computer * comp,const event_provider & event,void * userdata)` 

Queues a Lua event to be sent to a computer. 
#### Parameters
* `comp` The computer to send the event to 

* `event` The event provider function to queue 

* `userdata` An opaque pointer storing any user data for the provider 

**See also**: event_provider The prototype for the event provider

### `void * `[`queueTask`](#PluginFunctions-structure_1a6205d61b5625a0df9460d8c125e5f748)`(const std::function< void *(void *)> & func,void * userdata,bool async)` 

Runs a function on the main thread, and returns the result from the function. 
#### Parameters
* `func` The function to call 

* `userdata` An opaque pointer to pass to the function 

* `async` Whether to run the function asynchronously (if true, returns NULL immediately) 

#### Returns
The value returned from the function, or NULL if async is true

### `std::string `[`getConfigSetting`](#PluginFunctions-structure_1acb14e40003eb1ab654e9a6131098f2b5)`(const std::string & name)` 

Returns the value of a custom configuration setting as a string. 
#### Parameters
* `name` The name of the setting 

#### Returns
The value of the setting 

#### Exceptions
* `std::out_of_range` If the config setting does not exist

### `int `[`getConfigSettingInt`](#PluginFunctions-structure_1aded6ed0c0c78afde399df0542d3244f3)`(const std::string & name)` 

Returns the value of a custom configuration setting as an integer. 
#### Parameters
* `name` The name of the setting 

#### Returns
The value of the setting 

#### Exceptions
* `std::out_of_range` If the config setting does not exist 

* `std::invalid_argument` If the config setting is not an integer

### `bool `[`getConfigSettingBool`](#PluginFunctions-structure_1aeaf0af6b1c67c239071614aa1df1700e)`(const std::string & name)` 

Returns the value of a custom configuration setting as a boolean. 
#### Parameters
* `name` The name of the setting 

#### Returns
The value of the setting 

#### Exceptions
* `std::out_of_range` If the config setting does not exist 

* `std::invalid_argument` If the config setting is not a boolean

### `void `[`setConfigSetting`](#PluginFunctions-structure_1a7d775793bb2225883152b3904111ca57)`(const std::string & name,const std::string & value)` 

Sets a custom configuration variable as a string. 
#### Parameters
* `name` The name of the setting 

* `value` The value of the setting

### `void `[`setConfigSettingInt`](#PluginFunctions-structure_1a6148d1552d737c201c4ea706bf95f589)`(const std::string & name,int value)` 

Sets a custom configuration variable as an integer. 
#### Parameters
* `name` The name of the setting 

* `value` The value of the setting

### `void `[`setConfigSettingBool`](#PluginFunctions-structure_1ab25a170f3b9683fe3b344775c0e251ff)`(const std::string & name,bool value)` 

Sets a custom configuration variable as a boolean. 
#### Parameters
* `name` The name of the setting 

* `value` The value of the setting

### `void `[`registerConfigSetting`](#PluginFunctions-structure_1ab25a170f3b9683fe3b344775c0e251ff)`(const std::string & name,int type,const std::function<int(const std::string &,void *)> & callback, void * userdata)` 

Registers a custom config setting so it can be accessed with the config API, with an optional callback. Pass nullptr to callback to ignore.
#### Parameters
* `name` The name of the setting 

* `type` The type of the setting: 0 for boolean, 1 for integer, 2 for string

* `callback` A callback to call when the setting is changed. This takes the name and userdata, and returns 0 for immediate use, 1 to reboot the computer, and 2 to restart CraftOS-PC before taking effect. Set this to nullptr to not call a function.

* `userdata` An optional opaque pointer to pass to the function.

### `peripheral * attachPeripheral(Computer * computer, const std::string& side, const std::string& type, std::string * errorReturn, const char * format, ...)`

Attaches a peripheral of the specified type to a side, with optional extended arguments.

#### Parameters
* `computer` The computer to attach to
* `side` The side to attach the peripheral on
* `type` The type of peripheral to attach
* `errorReturn` A pointer to a string to hold an error message (NULL to ignore)
* `format` A format string specifying the arguments passed - 1 character per argument; set to "L" to pass a Lua state instead  
    'i' = lua_Integer, 'n' = lua_Number, 's' = const char *, 'b' = bool, 'N' = nil/NULL (pass NULL in the arg list)
* `...` Any arguments to pass to the constructor

#### Returns
The new peripheral object, or NULL on error

#### Throws
* `std::invalid_argument` If the format string is invalid
* `std::exception` If the peripheral constructor throws an exception

### `bool detachPeripheral(Computer * computer, const std::string& side)`

Detaches a peripheral from a side.

#### Parameters
* `computer` The computer to detach from
* `side` The side to detach

#### Returns
Whether the operation succeeded

### `void addEventHook(const std::string& event, Computer * computer, const event_hook& hook, void* userdata)`

Adds a hook function to be called when an event of a specific type is
queued from C++. The hook is called directly after the callback function
for the event, with the same parameters as an event provider + an
additional field for the event name. It returns the new name of the event,
which for most applications should be the same as the input. If the event
name returned is empty, the event is removed from the queue. Hooks are
executed in the order they were added. Computer hooks are executed
before global hooks.

#### Parameters
* `event` The name of the event to hook
* `computer` The computer to hook for, or NULL for all computers
* `hook` The hook function to execute
* `userdata` An opaque pointer to pass to the function

### `void setDistanceProvider(const std::function<double(const Computer *, const Computer *)>& func)`

Sets a custom disance provider for modems.

#### Parameters
* `func` The callback function to use to get distance. It takes two
computer arguments (the sender and receiver), and returns a double
specifying the distance.

## `PluginInfo` structure

The [PluginInfo](#PluginInfo-structure) structure is used to hold information about a plugin. This structure is returned by plugin_init to indicate some properties about the plugin. The default values in this structure will not change any functionality - feel free to leave them at their default values, or change them to configure your plugin.

### `unsigned `[`abi_version`](#PluginInfo-structure_1af579acc308b2f0c4b3857ede9354e57c) 

The required ABI version for the plugin. Defaults to the version being built for.

### `unsigned `[`minimum_structure_version`](#PluginInfo-structure_1a88675eff27d38e66275a56f9492eac42) 

The minumum required structure version. Defaults to 0 (works with any version).

### `std::string `[`luaopenName`](#PluginInfo-structure_1a1d59ab02a59133cc561cbd30d6a1078c) 

The name of the `luaopen` function. This may be useful to be able to rename the plugin file without breaking `luaopen`.

### `std::string `[`failureReason`](#PluginInfo-structure_1a35dd0cfbb0a7c2a2c6eed3ad064f3591) 

This can be used to trigger a load failure without throwing an exception. Set this field to any non-blank value to stop loading.

### `std::string `[`apiName`](#PluginInfo-structure_1a6390d8dd5af9a537fba6e6be3e2601fd) 

The name of the API. This can be used to override the default, which is determined by filename. This will also affect luaopenName if that's not set.

### `inline  `[`PluginInfo`](#PluginInfo-structure_1a37a95afcb45254a6b59f8d6cf0fcec15)`(const std::string & api,unsigned sv)` 

Returns a dynamically-allocated error info structure. Make sure you have a `plugin_deinit` function in place first.

#### Parameters
* `api` The name of the API.

* `sv` The minimum structure version required for the plugin; defaults to 0.

### ABI compatibility
When compiling plugins, you must use a compiler that is compatible with CraftOS-PC.
* On Windows, CraftOS-PC is built with Visual Studio 2019. You may build plugins for Windows with Visual Studio 2015, 2017, or 2019, or Clang. You may not use MinGW to build plugins.
* On macOS, CraftOS-PC is built with Clang 12 using libc++. You may build plugins for macOS with Clang. You may not use GCC to build plugins, unless you manually link with libc++.
* On Linux, CraftOS-PC is built with GCC using libstdc++. You may build plugins for Linux with GCC 3.4.0+, or Clang with libstdc++ (default, or use `-stdlib=libstdc++`).

#### API versions
| API Version | Structure Version | CraftOS-PC Version |
|-------------|-------------------|--------------------|
| (none)      | (none)            | v2.0 - v2.1.3      |
| 2           | (none)            | v2.2 - v2.3.4      |
| 3           | (none)            | Accelerated v2.2   |
| 4           | (none)            | v2.4 - v2.4.5      |
| 10          | 0                 | v2.5 - v2.5.1.1    |
| 10          | 1                 | v2.5.2             |
| 10          | 2                 | v2.5.3             |
| 10          | 3                 | v2.5.4 - v2.5.5    |
| 10          | 4                 | v2.6               |
| 10          | 5                 | v2.6.1             |
| 10          | 6                 | v2.6.2             |
| 10          | 7                 | v2.6.3 - v2.6.4    |
| 10          | 8                 | v2.6.5 - v2.7      |
| 11          | 0                 | Accelerated v2.5 - v2.5.1.1 |
| 11          | 1                 | Accelerated v2.5.2 |
| 11          | 2                 | Accelerated v2.5.3 |
| 11          | 3                 | Accelerated v2.5.4 - v2.5.5 |
| 11          | 4                 | Accelerated v2.6   |
| 11          | 5                 | Accelerated v2.6.1 |
| 11          | 6                 | Accelerated v2.6.2 |
| 11          | 7                 | Accelerated v2.6.3 - v2.6.4 |
| 11          | 8                 | Accelerated v2.6.5 - v2.7 |

*Note: When building for debug targets on Windows, add 100000 to the plugin version.*
