# CraftOS-PC for Mobile Devices
CraftOS-PC is available as an app for iOS and Android devices. CraftOS-PC Mobile has most of the same features as the desktop version, but there's some important differences due to being on a mobile device.

## Navigation Bar
Since mobile devices only display one or two apps at a time, CraftOS-PC can't open multiple windows for computers and monitors. Instead, all windows are contained in the same screen, and a navigation bar holds buttons to change windows. The navigation bar also shows the title, and has close and keyboard toggle buttons.

Use the keyboard button to open and close the keyboard.

![iOS navigation bar](../images/navbar-ios.png)

![Android navigation bar](../images/navbar-android.png)

The navigation bar starts hidden by default, to avoid hiding the contents of the screen. To make it appear, tap the screen anywhere with two fingers.

## Keyboard
The keyboard has an extra toolbar placed on top to add some common keys that aren't usually available on mobile keyboards.
- The Ctrl and Alt buttons toggle holding the Control and Alt keys down.
- The ⇥ (right arrow to bar) button presses the Tab key.
- The 📋︎ (clipboard) button pastes copied text.

The red buttons require holding them down for several seconds. They may not activate until you let go.
- The <span style="color: red">⊝</span> (circle with dash) button sends a terminate event to the running program.
- The <span style="color: red">⏻</span> (power) button turns the computer off immediately.
- The <span style="color: red">◁</span> (left triangle) button restarts the computer immediately.

On iOS, the   ⋯⃝ (circle with three dots) button shows an extra panel with navigation keys and the paste button.
- The ←/↑/↓/→ (arrow) buttons press the arrow keys.
- The ⤒ and ⤓ (up and down arrow with bar) buttons press the Page Up and Down keys, respectively.

Some functions are available to control whether the keyboard is open from Lua.

### Functions
* *nil* `mobile.openKeyboard`(\[*boolean* open\]): Opens or closes the keyboard.
  * open: If false, this closes the keyboard; otherwise, the keyboard is opened
* *boolean* `mobile.isKeyboardOpen`(): Returns whether the keyboard is currently open.

### Events
* `_CCPC_mobile_keyboard_open`: Sent when the keyboard is opened.
  * *number*: The visible height of the screen in chatacter cells
* `_CCPC_mobile_keyboard_close`: Sent when the keyboard is closed.

## Gestures
Some gestures are available to emulate keyboard key presses. Not all gestures are available on Android.
- Tap once with two fingers to toggle the navigation bar.
- Tap twice with two fingers to press the Tab key.
- Swipe with two fingers in any direction to press an arrow key in that direction.
- Hold two fingers on any screen edge to hold an arrow key in that direction.
