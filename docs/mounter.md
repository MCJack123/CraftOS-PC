# File System Mounting
CraftOS-PC supports mounting folders outside of the ComputerCraft environment. This means you can access and execute files outside of the computer root, such as your Downloads folder. Mounting directories can be done either from the shell or from Lua.

## From the shell
The "mount" command can be used to mount directories. It requires two arguments: the path of the mount inside CraftOS, and the outside path to mount from. An optional third argument "readOnly" can be specified to set the mount as read-only. If run without any arguments, "mount" will print all current mounts.

The "unmount" ("umount") command unmounts a mounted path. It takes the path of the mount to unmount, and it will unmount it.

## From Lua
The `mounter` API can be used to mount paths through Lua. The `mounter.mount(name, path[, readOnly])` function will mount a local path at `name` to an outside path at `path`. This mount can be marked as read-only if `readOnly` is set to true. `mounter.unmount(name)` unmounts the mount located at `name`.

The `mounter.list()` function returns a key-value table with all of the mount mappings. In CraftOS-PC v2.2 and earlier, the value of a mount is a string; and in CraftOS-PC v2.3 and later, the value is a list of strings. `mounter.isReadOnly(name)` returns whether a mount is marked read-only. Both of these functions are used internally by the "mount" program to list mounts.

## From the command line
Directories can be injected as mounts into CraftOS-PC straight from the command line. These mounts will be added before each computer starts up. There are three ways to specify mounts. Each of these flags should be followed by an argument of the format `<path>=<directory>`, where `<path>` is the destination path inside the computer, and `<directory>` is the path to the directory to mount.
* `--mount` will mount the path with whatever `mount_mode` is selected in the config.
* `--mount-rw` will force the mount to be read-write.
* `--mount-ro` will force the mount to be read-only.

## Mount mode configuration
By default, CraftOS-PC forces all mounts to be read-only for security reasons. If mounting in read-write mode is desired, the `mount_mode` configuration option has to be changed to allow this. There are four mount mode options available:
* `rw` (3): Mount in read-write mode by default
* `ro` (2): Mount in read-only mode by default, but allow read-write mounting
* `ro strict` (1) [default]: Always mount read-only, even if read-write is specified
* `none` (0): Disable mounting altogether

The option can be changed [just like other config options](configuration), but note that `mount_mode` is special in that it uses a string on the Lua side, but is stored as a number in the actual config file. If editing the file directly, use the numbers listed beside the name above instead of the name itself.

## Merge mounts
CraftOS-PC v2.3 adds support for *merge mounts* which allow mounting multiple real directories to a single CraftOS-PC mount. All that's required to create a merge mount is to mount two directories to the same path using the "mount" command or `mounter.mount`. When a merge mount is created, files and folders from all directories are available inside the mounted path. The order that the directories are mounted *does matter*, as the first mounted directory will take priority over later mounts if duplicates are detected.

Real paths are resolved using the following method: (examples assume `a` and `b` are mounted to `/mnt`)
* When reading a file, it finds the first file that exists at the requested path.
  * If `/mnt/file.txt` is requested, it will first check for the existence of `a/file.txt`, then `b/file.txt`.
  * If `/mnt/dir/file.txt` is requested, it will first check for the existence of `a/dir/file.txt`, then `b/dir/file.txt`.
* When writing a file, it first uses the same method as reading files if the file exists.
* If writing a file that doesn't exist, it writes to the first mount that has the subdirectories specified. If writing to the root of the mount, it will always write to the first mount.
  * If `/mnt/file.txt` is requested and it doesn't exist, it will always write to `a/file.txt`.
  * If `/mnt/dir/file.txt` is requested and it doesn't exist, it will write to `a/dir/file.txt` if `a/dir` exists, or `b/dir/file.txt` if `b/dir` exists.
    * If neither exists and if using a function that creates the subdirectories, it will create `a/dir` and writes to `a/dir/file.txt`.
    * Otherwise, an error will occur.

## Mounter black/whitelists
CraftOS-PC v2.7 introduces a blacklist/whitelist system to block mounting for certain directories, and allowing others. These are available through the `mounter_blacklist` and `mounter_whitelist` configuration options. These are stored as JSON lists of strings indicating the path to allow or block. The rules are processes so that each rule applies to that directory and all subdirectories, unless another rule is specified for a specific subdirectory, in which case that will take effect for it and its subdirectories. For example, this rule set will block access to the root and the shared users directory, while allowing access to the users directory itself and all other subdirectories:
```json
"mounter_blacklist": [
  "/",
  "/Users/Shared"
],
"mounter_whitelist": [
  "/Users"
]
```

You can also use wildcards to match all patterns in a path. For example, `/Users/*/Downloads` will match `/Users/bob/Downloads` and `/Users/admin/Downloads`, but not `/Users/admin/Documents`.

The `/` and `\` characters are equivalent, so Windows users don't have to use specifically `\`. On Windows, specifying a Unix-style root (`/*`) will use the C: drive, so `/Program Files` is equivalent to `C:\Program Files`.

### No-ask whitelist
There is also a list called `mounter_no_ask` that will disable mount confirmation for the specified paths. These entries only apply to the specific folder indicated, and not any subdirectories. Be careful when using this, as any script will be able to silently mount the directories specified here.

## Functions
* *boolean* `mounter.mount`(*string* name, *string* path\[, *boolean* readOnly\]): Mounts a real directory to a ComputerCraft directory.
  * name: The local directory to mount to
  * path: The absolute directory to mount from
  * readOnly: Whether the mount should be read-only. The default value and whether this argument is available depend on the value of the `mount_mode` config option.
  * Returns: Whether the mount operation succeeded
* *boolean* `mounter.unmount`(*string* name): Unmounts a previously mounted directory.
  * name: The local directory to unmount
  * Returns: Whether the unmount operation succeeded
* *table* `mounter.list`(): Returns a key-value table of all current mounts on the system. Each value is a list of directories in a multi-mount (if not using multi-mounts, then only one value is in that list).
* *boolean* `mounter.isReadOnly`(*string* name): Returns whether a mount was mounted read-only.
  * name: The local directory of the mount
  * Returns: Whether the mount is read-only
