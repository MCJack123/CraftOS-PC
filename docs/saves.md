# Save Data Structure & Location
CraftOS-PC stores user data inside the user's home directory. This page lists the location of the data, as well as the contents that you can expect to see inside it.

## Save Location
The actual path to the data varies by platform. Here are the locations of the CraftOS-PC save directory for known platforms:
* Windows: `C:\Users\<username>\AppData\Roaming\CraftOS-PC` (or `%appdata%\CraftOS-PC`)
* Mac: `/Users/<username>/Library/Application Support/CraftOS-PC`
* Linux: `$XDG_DATA_HOME/craftos-pc` or `/home/<username>/.local/share/craftos-pc`

## Save Directory Structure
These are the files & folders you can expect to see inside the CraftOS-PC save directory:
* `computer/`: Computer save data
    * `disk/`: Disk drive data
        * `<id>/`: Contents of disk
    * `<id>/`: Contents of computer
* `config/`: Configuration files
    * `global.json`: Global configuration file
    * `<id>.json`: Per-computer configuration files
* `screenshots/`: Screenshots & recordings
    * `YYYY-MM-DD_hh.mm.ss.[png|bmp]`: Screenshot files
    * `YYYY-MM-DD_hh.mm.ss.gif`: Recording files