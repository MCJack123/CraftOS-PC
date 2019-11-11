# Debugger
CraftOS-PC v2.2 introduces a new debugger peripheral that allows in-depth examination of what's going on inside a program. Upon attaching the debugger, a new window will appear with the debugger interface.

## Windows
The debugger has multiple windows that can show information about the process. It has a multishell-style tab bar at the top, allowing you to quickly switch between each window.

### Debugger
The Debugger window is the main window of the debugger. It has a GDB-style interface that allows stepping through lines, setting breakpoints, and examining the environment. You can trigger the debugger either by calling the `break()` method of the debugger peripheral, or you can hold Ctrl-T on the debugger window to trigger a manual break.

### File Viewer
The File Viewer window allows you to view the file that is currently running while in break mode. It highlights the current line the computer is executing inside the script it's running. You can press the enter key to step one line.

### Profiler
The Profiler window is a basic profiler that shows run time and call counts for each function being run. Just click on the record button at the top, and the calls will start to be recorded. Press record again to stop recording.

### Console
The Console window shows any output that's been sent to the console via the `print(text)` method of the debugger peripheral.