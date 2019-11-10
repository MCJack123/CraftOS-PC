# File System Mounting
CraftOS-PC supports mounting folders outside of the ComputerCraft environment. This means you can access and execute files outside of the computer root, such as your Downloads folder. Mounting directories can be done either from the shell or from Lua.

## From the shell
The "mount" command can be used to mount directories. It requires two arguments: the path of the mount inside CraftOS, and the outside path to mount from. An optional third argument "readOnly" can be specified to set the mount as read-only. If run without any arguments, "mount" will print all current mounts.

The "unmount" ("umount") command unmounts a mounted path. It takes the path of the mount to unmount, and it will unmount it.

## From Lua
The `mounter` API can be used to mount paths through Lua. The `mounter.mount(name, path[, readOnly])` function will mount a local path at `name` to an outside path at `path`. This mount can be marked as read-only if `readOnly` is set to true. `mounter.unmount(name)` unmounts the mount located at `name`.

The `mounter.list()` function returns a key-value table with all of the mount mappings. `mounter.isReadOnly(name)` returns whether a mount is marked read-only. Both of these functions are used internally by the "mount" program to list mounts.