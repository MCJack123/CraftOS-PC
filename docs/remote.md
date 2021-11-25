# CraftOS-PC Remote
CraftOS-PC Remote is an online service that allows you to connect to a ComputerCraft computer inside Visual Studio Code.

Even though it has CraftOS-PC in the name, it supports all ComputerCraft computers - even computers on Minecraft servers!

## Setup
CraftOS-PC Remote requires CC: Tweaked 1.85.0 or later, but 1.91.0 or later is recommended.

To set up CraftOS-PC Remote, first install the [CraftOS-PC extension](extension), version 1.1 or later. Upon installation, a new button will appear in the sidebar with the CraftOS-PC logo.

In addition, if connecting to a computer in Minecraft, you will need to make sure that the computer that hosts the Minecraft world is able to use Let's Encrypt HTTPS certificates. By default, Minecraft comes with a very old version of Java that does not support these certificates. (This is not applicable for Minecraft 1.17 and later.)

If playing on a singleplayer world, you'll need to install the latest version of [Java](https://java.com). After that, open the Minecraft launcher, click on the Installations tab, click on the "..." button next to the Forge installation, and click Edit. Then click on More Options, and click Browse under Java Executable. Assuming Java is installed to the default directory, use one of these paths depending on your OS:

* Windows: `C:\Program Files\Java\jre1.8.0_<ver>\bin\javaw`
* macOS: `/Library/Java/JavaVirtualMachines/jre1.8.0_<ver>/bin/java`
* Linux: `/usr/bin/java`

Replace `<ver>` with the version of Java you installed. This is listed at the top of the Java download site after the word "Update" (e.g. "Recommended Version 8 Update 291" -> replace `<ver>` with `291`).

Multiplayer servers do not have a bundled Java version, and use the system's Java installation instead. This should already support the certificates, so you don't need to change anything. CraftOS-PC uses the system's certificate store which should include the certificates, and CCEmuX is in the same situation as servers, so it should be fine as well.

### "Certificate has expired" error

If you're using newer versions of VS Code, you may get a message saying "certificate has expired" or "A bug in VS Code is causing the connection to fail". This is due to a bug in VS Code with the certificates that allow secure communication to the Remote server. To fix it, press Shift+Ctrl+P (Shift+Cmd+P on Mac), type in "Preferences: Open Settings (JSON)", and add this just before the last `}` (adding a comma to the line before if there isn't one already):
```json
"http.systemCertificates": false
```
Then restart VS Code and try again.

For example, if the settings file has this before:
```json
{
    "git.autofetch": true,
    "files.autoSave": "afterDelay"
}
```
It should contain this after the fix:
```json
{
    "git.autofetch": true,
    "files.autoSave": "afterDelay",
    "http.systemCertificates": false
}
```

## Usage
To start a new session, click on the CraftOS-PC button in the sidebar of VS Code, and click on the "Connect to Remote" button. A new window will open up in VS Code awaiting a connection from the computer. A connection command will also be copied to the clipboard. Simply paste this into the shell of the computer you want to control and press enter. A connection will be established, and you should now be able to see the contents of the screen in VS Code.

Alternatively, you may use the [remote.craftos-pc.cc](https://remote.craftos-pc.cc) website to initiate a connection. Just click on the Connect Now button on the page, and paste the command given into the ComputerCraft computer.

To open files on the computer, you have to add the computer folder to your workspace. Hover over the ComputerCraft Remote Terminal entry in the CraftOS-PC tab, and click the Remote button (looks like a screen and a circle with two arrows). This will add the folder to the current workspace. Unfortunately, due to technical limitations in VS Code, this will usually cause the connection to be closed. You can simply follow the steps above to reconnect, and the folder will still work even after reconnecting. (You may have to click the Refresh button in the Explorer after reconnecting.) To avoid having to do this every time, it's suggested that you save the workspace and re-open it whenever you need to connect again.

From this point, you can now use the computer entirely within VS Code. Edits made in VS Code will immediately show up on the computer after saving, and edits made in ComputerCraft will usually appear in the file (though you may have to re-open the file). However, files created on the ComputerCraft side will not immediately appear in VS Code: you'll have to click the Refresh button to see them. This will be fixed at a later date.

## Exiting
To close the session, either exit the shell session in ComputerCraft, or hover over the Computers section of the CraftOS-PC tab and click the X button. This will close the session, and the computer will return back to an empty shell.
