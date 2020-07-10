# Graphics Mode
CraftOS-PC introduces a brand-new graphics mode to the ComputerCraft terminal, adding support for high-resolution pixel manipulation with up to 256 colors available paletted. This allows programs to have a level of detail never before seen in CraftOS.

## Activating graphics mode
The `term.setGraphicsMode(mode)` function is the gateway to graphics mode. This function switches the terminal into and out of graphics mode. Currently there are three modes available:
* 0 (false): Text mode. This is the default ComputerCraft terminal.
* 1 (true): 16-color graphics mode.
* 2: 256-color graphics mode.

Changing into graphics mode will hide the text terminal, but it can still be written to, so any output will appear on the terminal upon switching out of graphics mode. The current graphics mode can be returned with `term.getGraphicsMode()`. It will return false for text mode and the mode number for graphics modes.

The size of the graphics mode screen is exactly 6 times the width and 9 times the height of the size of the text terminal (as returned by `term.getSize()`). If you want to get the size of the screen, you can use a function like this:

```lua
local function getGraphicsSize()
    local w, h = term.getSize()
    return w * 6, h * 9
end
```

## Setting pixels
In graphics mode, the `term.setPixel(x, y, color)` function can be used to set a pixel to a color. The color argument has different meanings depending on the mode. In mode 1, the color argument must be a color from the `colors` API. In mode 2, the color argument must be a number between 0-255. Switching to mode 2 also changes the color argument for `term.setPaletteColor` and `term.getPaletteColor`.

To draw many pixels at once, the `term.drawPixels(startX, startY, pixels)` function can be called. It takes an initial X and Y position and draws lines of pixels in a table. Each line may be either a string with the byte value of each character representing a color from 0-15 (0-255 in 256-color mode); or a line can be a table with each entry representing one pixel as specified in `term.setPixel`. This function allows drawing pixels quicker than using `term.setPixel` for each pixel.

The length of each line of pixels to draw in `term.drawPixels` is determined with the length operator, so pixels will be drawn starting at the initial X position for the length of the string or until the first `nil` in the table. This also goes for the parent table that is passed in: lines will be drawn starting at the initial Y position until the first `nil` line is encountered.

In 256-color mode, the first 16 colors are set to the default ComputerCraft palette, but the rest are unset. To take advantage of all of the colors available, the `term.setPaletteColor` function is used to set the remaining colors as needed.

The `paintutils` API supports graphics mode in the same way as usual. All `paintutils` functions can be used in graphics mode, drawing pixels instead of color characters.