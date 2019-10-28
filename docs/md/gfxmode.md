# Graphics Mode
CraftOS-PC introduces a brand-new graphics mode to the ComputerCraft terminal, adding support for high-resolution pixel manipulation with up to 256 colors available paletted. This allows programs to have a level of detail never before seen in CraftOS.

## Activating graphics mode
The `term.setGraphicsMode(mode)` function is the gateway to graphics mode. This function switches the terminal into and out of graphics mode. Currently there are three modes available:
* 0 (false): Text mode. This is the default ComputerCraft terminal.
* 1 (true): 16-color graphics mode.
* 2: 256-color graphics mode.

Changing into graphics mode will hide the text terminal, but it can still be written to, so any output will appear on the terminal upon switching out of graphics mode. The current graphics mode can be returned with `term.getGraphicsMode()`. It will return false for text mode and the mode number for graphics modes.

## Setting pixels
In graphics mode, the `term.setPixel(x, y, color)` function can be used to set a pixel to a color. The color argument has different meanings depending on the mode. In mode 1, the color argument must be a color from the `colors` API. In mode 2, the color argument must be a number between 0-255. Switching to mode 2 also changes the color argument for `term.setPaletteColor` and `term.getPaletteColor`.

In 256-color mode, the first 16 colors are set to the default ComputerCraft palette, but the rest are unset. To take advantage of all of the colors available, the `term.setPaletteColor` function is used to set the remaining colors as needed.

The `paintutils` API supports graphics mode in the same way as usual. All `paintutils` functions can be used in graphics mode, drawing pixels instead of color characters.