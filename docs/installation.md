# Installation
CraftOS-PC can be installed either through the prebuilt binaries available on the [releases](https://github.com/MCJack123/craftos2/releases) page, or by building it from the source code on GitHub.

## Requirements
* Windows Vista or later, 64-bit only
* macOS Mavericks 10.9.5 or later
* Ubuntu 18.04 LTS Bionic, 20.04 LTS Focal, or 22.04 LTS Jammy
* Raspberry Pi OS 11 (Bullseye)
* Fedora 33+
* Arch Linux or derivative
* iOS 11.0 or later
* Android 7.0 Nougat or later

## Windows
1. Download the setup program from the [home page](../).
2. Double-click the downloaded `CraftOS-PC-Setup.exe` file to open the installer.
3. You may get a message from SmartScreen that the file isn't recognized. Click More info and Run anyway to continue.
4. Select whether to install for just you or the whole system. If you install for the whole system, you will need an administrator password.
5. Follow the instructions in the setup wizard.
6. Once installed, CraftOS-PC will be available in the Start menu (and on the Desktop if selected).

## Mac
1. Download the application archive from the [home page](../).
2. Open the disk image in the Finder.
3. Drag `CraftOS-PC.app` into the Applications folder icon.
4. Open CraftOS-PC from Applications or Launchpad.

## Linux
CraftOS-PC is provided in binary form for Ubuntu and Fedora, and in source form for Arch Linux on the AUR. It is not available as a plain binary for other distributions, so non-Ubuntu/Fedora/Arch users will have to [build from source](#building-from-source).

### Ubuntu/Linux Mint (18.04, 20.04, 21.10)
Run these commands in the shell:
```sh
sudo add-apt-repository ppa:jackmacwindows/ppa
sudo apt update
sudo apt install craftos-pc
```
Once installed, CraftOS-PC can be run either from the launcher or with the `craftos` command.

### Raspberry Pi OS (11, 32/64-bit supported)
Edit `/etc/apt/sources.list` using your editor of choice, and add this line to the bottom:
```
deb https://www.craftos-pc.cc/raspi bullseye main
```
Then run the following commands:
```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 1D99413F734AA894
sudo apt update
sudo apt install craftos-pc
```
Once installed, CraftOS-PC can be run either from the app menu (if the desktop is installed) or with the `craftos` command.

### Arch Linux/Manjaro
Install the `craftos-pc` package using your favorite AUR package manager, such as `yay`. (If you're using Arch I assume you either know what this means or know how to figure out what this means.) Once installed, CraftOS-PC can be run using the `craftos` command or from your desktop environment's launcher.

If you prefer to always be running the latest revision as on GitHub, you can install the `craftos-pc-git` package, which builds from the latest source on the `master` branch. Running development versions may cause problems, so use it at your own risk. Support is limited for this version. To keep the files separate, `craftos-pc-git` installs into `/usr/local` (instead of `/usr`), so you can keep both versions available on your system.

### Fedora
First, enable the COPR repo, then install the `craftos-pc` package:
```sh
sudo dnf copr enable lemoonstar/CraftOS-PC
sudo dnf install craftos-pc
```

Fedora support is maintained by [LeMoonStar](https://github.com/LeMoonStar). For any issues with the Fedora package itself, please contact them [on their GitHub repo](https://github.com/LeMoonStar/craftos2-rpm).

## iOS
[Visit the App Store](https://apps.apple.com/us/app/craftos-pc/id1565893014) to download CraftOS-PC. Or you can [join the TestFlight beta](https://testflight.apple.com/join/SiuXlijR) to get access to the latest versions before they're released.

## Android
1. Download the latest APK from the [home page](../)
2. Open the file and tap "Install".
3. Once installed, the app will be available in the app drawer and on the home screen.

## Windows/Android Nightly Builds
Nightly builds of CraftOS-PC are available [on the website](https://www.craftos-pc.cc/nightly/). These builds are provided to allow Windows users to test new features without having to build the entire solution and dependencies. New builds are posted at midnight EST, unless there were no changes since the last build. The download page lists the three latest builds, but older builds are available by direct link. Note that these files are just the raw executable; if there were changes to the ROM you must pull them in manually.

Beta Android builds are also available on the same page. These are uploaded much less frequently, but are occasionally made available when some mobile-only features need testing. Simply install the APK just like the normal release. These will upgrade the original app, so make sure you don't have anything important in the app before using them.

# Building from source
If you are using an operating system without binaries available (or you want the latest development features), you can build CraftOS-PC from the source code.

Note: You should clone the repository using `git`. Downloading an archive from GitHub will not work unless you manually download [craftos2-lua](https://github.com/MCJack123/craftos2-lua) into the `craftos2-lua` folder in the archive. (In that case, you can skip any `git submodule` steps since Lua is already downloaded.)

## Requirements
* [CraftOS ROM package](https://github.com/MCJack123/craftos2-rom)
* Compiler supporting C++14
  * Linux: G++ 4.9+, make
  * Mac: Xcode CLI tools (xcode-select --install)
  * Windows: Visual Studio 2019
* SDL 2.0.8+ (may work on older versions on non-Linux)
* OpenSSL 1.1 (for POCO)
* POCO 1.5.0+: NetSSL & JSON libraries + dependencies
  * Foundation
  * Util
  * Crypto
  * XML
  * JSON
  * Net
  * NetSSL
    * On Windows, you'll need to modify the `poco` port to use OpenSSL. Simply open `vcpkg\ports\poco\portfile.cmake`, find `ENABLE_NETSSL_WIN`, and replace it with `FORCE_OPENSSL`. Then install as normal.
* Windows: dirent.h (install with NuGet OR vcpkg)
* Windows: [vcpkg](https://github.com/microsoft/vcpkg)

### Optional
* libpng 1.6 & png++ 0.2.7+
  * Can be disabled with `--without-png`, will save as BMP instead
* [libharu/libhpdf](https://github.com/libharu/libharu)
  * Can be disabled with `--without-hpdf`, `--with-html` or `--with-txt`
* ncurses or PDCurses
  * Can be disabled with `--without-ncurses`, will disable CLI support
* SDL_mixer 2.0+
  * Can be disabled with `--without-sdl_mixer`, will disable audio disc and speaker support
  * For MP3 support, libmpg123 is required
  * For FLAC support, libFLAC is required
  * For SF2 support, SDL_mixer must be built manually with fluidsynth support (or with the `fluidsynth` feature in vcpkg since July 9, 2021)
* The path to the ROM package can be changed with `--prefix=<path>`, which will store the ROM at `<path>/share/craftos`
* Standalone builds can be enabled with `--with-standalone-rom=<fs_standalone.cpp>`, with `<fs_standalone.cpp>` referring to the path to the packed standalone ROM file.
  * The latest packed ROM can be downloaded as an artifact from the latest CI build, found by following the top link [here](https://github.com/MCJack123/craftos2-rom/actions).

You can get all of these dependencies with:
  * Windows: `vcpkg --feature-flags=manifests install --triplet x64-windows` inside the repository directory
    * Visual Studio will do this for you automatically (as long as vcpkg integration is installed)
  * Windows (manual): `vcpkg install sdl2:x64-windows sdl2-mixer[dynamic-load,libflac,mpg123,libmodplug,libvorbis,opusfile,fluidsynth]:x64-windows pngpp:x64-windows libharu:x64-windows poco[netssl]:x64-windows dirent:x64-windows pdcurses:x64-windows`
  * Mac (Homebrew): `brew install sdl2 sdl2_mixer png++ libharu poco ncurses; git clone https://github.com/MCJack123/craftos2-rom`
  * Ubuntu: `sudo apt install git build-essential libsdl2-dev libsdl2-mixer-dev libhpdf-dev libpng++-dev libpoco-dev libncurses5-dev; git clone https://github.com/MCJack123/craftos2-rom`
  * Arch Linux: `sudo pacman -S sdl2 sdl2_mixer png++ libharu poco ncurses`

## Instructions
### Windows
1. Download [Visual Studio 2019](https://visualstudio.microsoft.com/) if not already installed
2. `git submodule update --init --recursive`
3. Open `CraftOS-PC 2.sln` with VS
4. Build solution
5. Copy all files from the ROM into the same directory as the new executable (ex. `craftos2\x64\Release`)
6. Run solution

The solution has a few different build configurations:
* Debug: for debugging, no optimization
* Release: standard Windows application build with optimization (same as installed `CraftOS-PC.exe`)
* ReleaseC: same as Release but with console support (same as installed `CraftOS-PC_console.exe`)
* ReleaseStandalone: same as Release but builds a standalone build; requires `fs_standalone.cpp` to be present in `src`

### Mac
1. Open a new Terminal window
2. `cd` to the cloned repository
3. `git submodule update --init --recursive`
4. `make -C craftos2-lua macosx`
5. `./configure`
6. `make macapp`
7. Open the repository in a new Finder window
8. Right click on CraftOS-PC.app => Show Package Contents
9. Open Contents -> Resources
10. Copy the ROM package inside
11. Run CraftOS-PC.app

### Linux (or Mac as non-app binary)
1. Open a new terminal
2. `cd` to the cloned repository
3. `git submodule update --init --recursive`
4. `make -C craftos2-lua linux`
5. `./configure`
6. `make`
7. `sudo mkdir /usr/local/share/craftos`
8. Copy the ComputerCraft ROM into `/usr/local/share/craftos/`
9. `./craftos`
