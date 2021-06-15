# CraftOS-PC Extension
The CraftOS-PC Extension for Visual Studio Code adds some unique features to make ComputerCraft development easier. Its main feature lets you open CraftOS-PC windows directly inside VS Code, so you can edit files and then run them in the same window. It also has quick access to the CraftOS-PC configuration as well as the ability to connect to [CraftOS-PC Remote](remote) and [raw mode](rawmode) WebSocket servers.

## Installation
The CraftOS-PC extension is available [on the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=JackMacWindows.craftos-pc). Simply search for CraftOS-PC in the Extensions tab in the sidebar and click Install. Or open the link above and click Install there.

On Windows, you will need to install the console version of CraftOS-PC. This comes with the installer, but is not enabled by default. If you're unsure whether you have it, browse to where CraftOS-PC is installed, and check whether `CraftOS-PC_console.exe` exists. If not, run the CraftOS-PC installer again and make sure to check the "Console build" checkbox.

If you installed CraftOS-PC in a non-standard location (such as if you installed for the current user only), you'll have to set the path to the CraftOS-PC executable. Open the VS Code settings, disclose the Extensions menu on the side, and click CraftOS-PC. Then type in the path to the executable in the "Executable Path: All" text box.

## Usage
To open CraftOS-PC in VS Code, just click on the CraftOS-PC icon in the sidebar, and click Open CraftOS-PC. A new tab will open with the computer's window, and an entry will be added to the sidebar for the window.

![Extension screenshot](/images/vscode.png)

From this point, you can use CraftOS-PC as usual. New windows that are created will appear in the sidebar and open automatically. Closing a tab will simply hide it from the screen; you may click on the window in the sidebar to re-open the window.

To close a window, hover over its entry and click the X button. In addition, to quit CraftOS-PC entirely, click on the X button in the Computers header.

On CraftOS-PC v2.5.6 and later, you can also access the files for the computer from directly within VS Code. Click on the Remote button (looks like a screen and a circle with two arrows) on top of a computer window's entry, and the computer's virtual filesystem will be accessible within VS Code.

On older versions, you can still access the data folder by pressing Shift+Ctrl+P (Shift+Cmd+P on Mac) and typing "CraftOS-PC: Open Data Directory for Computer...". Then enter the ID of the computer to open, and that computer's data directory will be added to the current workspace. This also does not have the overhead of communicating with CraftOS-PC, instead using the filesystem directly.

A button to open the configuration file is available in the Computers header in the sidebar, and can be used whether or not CraftOS-PC has been opened.

## Remote Connections
The CraftOS-PC extension is also used as a way to display any connection that uses CraftOS-PC's raw mode protocol. This includes [CraftOS-PC Remote](remote), which allows connecting to a ComputerCraft computer in the same manner as CraftOS-PC. You can also connect to any WebSocket server that provides a connection to a raw mode server, such as CraftOS-PC connected over a WebSocket tunnel. This could let you host your local CraftOS-PC computer over the Internet without having to set up CraftOS-PC Remote to run on the computer.