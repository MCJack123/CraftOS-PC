# Installation
CraftOS-PC can be installed either through the prebuilt binaries available on the [releases](https://github.com/MCJack123/craftos2/releases) page, or by building it from the source code on GitHub.

## Requirements
* Windows Vista or later, 64-bit only
* macOS/OS X Mavericks 10.9.5 or later
* Ubuntu 18.04 Bionic, 19.04 Disco, or 19.10 Eoan
* Arch Linux or derivative

## Windows
1. Download the setup program from the [home page](../).
2. Double-click the downloaded `CraftOS-PC-Setup.exe` file to open the installer.
3. When prompted to run as administrator, click Yes.
4. Follow the instructions in the setup wizard.
5. Once installed, CraftOS-PC will be available in the Start menu (and on the Desktop if selected).

## Mac
1. Download the application archive from the [home page](../).
2. Open the disk image in the Finder.
3. Drag `CraftOS-PC.app` into the Applications folder icon.
4. Open CraftOS-PC from Applications or Launchpad.
### Note for Catalina Users
macOS Catalina adds a new policy requiring all apps to be notarized with a Developer ID. Because I don't have a paid dev account, CraftOS-PC cannot be notarized, meaning Catalina users can't just double click on the app at first launch. **When opening CraftOS-PC for the first time, make sure to right-click on the app and click Open, instead of double-clicking the app as usual.**

## Linux
CraftOS-PC is provided in binary form as both an Ubuntu package and an Arch Linux AUR package. It is not available as a plain binary for other distributions, so non-Ubuntu/Arch users will have to build from source.

### Ubuntu (18.04, 19.04, 19.10)
Run these commands in the shell:
```sh
sudo add-apt-repository ppa:jackmacwindows/ppa
sudo apt update
sudo apt install craftos-pc
```
Once installed, CraftOS-PC can be run either from the launcher or with the `craftos` command.

### Arch Linux
Install the `craftos-pc` package using your favorite AUR package manager. (If you're using Arch I assume you either know what this means or know how to figure out what this means.) Once installed, CraftOS-PC can be run using the `craftos` command or from your desktop environment's launcher.

## Windows Nightly Builds
Nightly builds of CraftOS-PC are available [on the website](https://www.craftos-pc.cc/nightly/). These builds are provided to allow Windows users to test new features without having to build the entire solution and dependencies. New builds are posted at midnight EST, unless there were no changes since the last build. The download page lists the three latest builds, but older builds are available by direct link. Note that these files are just the raw executable; if there were changes to the ROM you must pull them in manually.

# Building from source
If you are using an operating system without binaries available (or you want the latest development features), you can build CraftOS-PC from the source code.

Note: You should clone the repository using `git`. Downloading an archive from GitHub will not work unless you manually download [craftos2-lua](https://github.com/MCJack123/craftos2-lua) into the `craftos2-lua` folder in the archive. (In that case, you can skip any `git submodule` steps since Lua is already downloaded.)

## Requirements
* [CraftOS ROM package](https://github.com/MCJack123/craftos2-rom)
* Compiler supporting C++11
  * Linux: G++ 4.9+, make
  * Mac: Xcode CLI tools (xcode-select --install)
  * Windows: Visual Studio 2019
* SDL 2.0.8+ (may work on older versions on non-Linux)
* OpenSSL 1.0.x
* Windows: dirent.h
* POCO NetSSL + JSON libraries + dependencies
  * Foundation
  * Util
  * Crypto
  * XML
  * JSON
  * Net
  * NetSSL

#### Optional
* libpng 1.6 & png++ 0.2.7+
  * Can be disabled with `--without-png`, will save as BMP instead
* [libharu/libhpdf](https://github.com/libharu/libharu)
  * Can be disabled with `--without-hpdf`, `--with-html` or `--with-txt`
* ncurses
  * Can be disabled with `--without-ncurses`, will disable CLI support
* SDL_mixer 2.0+
  * Can be disabled with `--without-sdl_mixer`, will disable audio disc support
  * For MP3 support, libmpg123 is required
  * For FLAC support, libFLAC is required
  * For SF2 support, SDL_mixer must be built manually with fluidsynth support
* The path to the ROM package can be changed with `--prefix=<path>`, which will store the ROM at `<path>/share/craftos`
* Standalone builds can be enabled with `--with-standalone-rom=<fs_standalone.cpp>`, with `<fs_standalone.cpp>` referring to the path to the packed standalone ROM file.
  * The latest packed ROM can be downloaded as an artifact from the latest CI build, found by following the top link [here](https://github.com/MCJack123/craftos2-rom/actions).craftos`

You can get all of these dependencies with:
  * Windows: The VS solution includes all packages required except POCO and png (build yourself)
  * Mac (Homebrew): `brew install lua@5.1 sdl2 sdl2-mixer png++ libharu poco ncurses; git clone https://github.com/MCJack123/craftos2-rom`
  * Ubuntu: `sudo apt install git build-essential liblua5.1-0-dev libsdl2-dev libsdl2-mixer-dev libhpdf-dev libpng++-dev libpoco-dev libncurses5-dev; git clone https://github.com/MCJack123/craftos2-rom`
  * Arch Linux: `sudo pacman -S lua51 sdl2 sdl2_mixer openssl-1.0 png++ libharu poco ncurses`

### Instructions
#### Windows
1. Download [Visual Studio 2019](https://visualstudio.microsoft.com/) if not already installed
2. [Build Poco from source](https://pocoproject.org/download.html#visualstudio)
3. Open a new Explorer window in %ProgramFiles% (Win-R, %ProgramFiles%)
4. Create a directory named `CraftOS-PC`
5. Copy the contents of the CraftOS ROM into the directory
6. Open `CraftOS-PC 2.sln` with VS
7. Ensure all NuGet packages are installed
8. Right click on CraftOS-PC 2.vcxproj -> CraftOS-PC 2 Properties... -> Linker -> General -> Additional Library Search Paths -> Add the path to the poco/lib directory
9. Build & Run

#### Mac
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

#### Linux
1. Open a new terminal
2. `cd` to the cloned repository
3. `git submodule update --init --recursive`
4. `make -C craftos2-lua linux`
5. `./configure`
6. `make`
7. `sudo mkdir /usr/local/share/craftos`
8. Copy the ComputerCraft ROM into `/usr/local/share/craftos/`
9. `./craftos`