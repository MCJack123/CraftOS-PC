# Graphics Mode
CraftOS-PC introduces a brand-new graphics mode to the ComputerCraft terminal, adding support for high-resolution pixel manipulation with up to 256 colors available paletted. This allows programs to have a level of detail never before seen in CraftOS.

## Activating graphics mode
The `term.setGraphicsMode(mode)` function is the gateway to graphics mode. This function switches the terminal into and out of graphics mode. Currently there are three modes available:
* 0 (false): Text mode. This is the default ComputerCraft terminal.
* 1 (true): 16-color graphics mode.
* 2: 256-color graphics mode.

Changing into graphics mode will hide the text terminal, but it can still be written to, so any output will appear on the terminal upon switching out of graphics mode. The current graphics mode can be returned with `term.getGraphicsMode()`. It will return false for text mode and the mode number for graphics modes.

The size of the graphics mode screen, as of v2.5.1, is still guaranteed to be 6 times the width and 9 times the height of the text terminal by default. However, `term.getSize()` now accepts an optional argument specifying which mode to return the size of, and you are advised to use that function instead. Existing programs should be migrated to use the new overload if they require the pixel dimensions of the screen.

To get the pixel dimensions of the screen, depending on which mode you are in, you may want to use a function such as this one:

```lua
local function pixelDimensions()
    return term.getSize(term.getGraphicsMode() or 1)
end
```

Currently, all graphics modes have the same dimensions, but this behavior may change in the future. The relation between the text mode dimensions and graphics mode dimensions is not guaranteed to be upheld, so switching to `term.getSize()` is the correct solution.

For compatibility reasons, `term.getSize()` (with no arguments) always returns the size of text mode, not the current mode. This behavior is not likely to change.

## Setting pixels
In graphics mode, the `term.setPixel(x, y, color)` function can be used to set a pixel to a color. **Unlike the rest of the `term` API, the coordinates of the pixels start at position (0, 0), not (1, 1).** For example, to set the top-leftmost pixel to white, use `term.setPixel(0, 0, colors.white)`. The color argument has different meanings depending on the mode. In mode 1, the color argument must be a color from the `colors` API. In mode 2, the color argument must be a number between 0-255. Switching to mode 2 also changes the color argument for `term.setPaletteColor` and `term.getPaletteColor`.

To draw many pixels at once, the `term.drawPixels(startX, startY, pixels/color[, width[, height]])` function can be called. It takes an initial X and Y position and draws lines of pixels in a table. Each line may be either a string with the byte value of each character representing a color from 0-15 (0-255 in 256-color mode); or a line can be a table with each entry representing one pixel as specified in `term.setPixel`. It can also take a color argument, which will fill the specified area with the color selected. When using color fill, the width and height arguments are required. This function allows drawing pixels quicker than using `term.setPixel` for each pixel.

If the height argument isn't specified, the length of each line of pixels to draw in `term.drawPixels` is determined with the length operator, so pixels will be drawn starting at the initial X position for the length of the string or until the first `nil` in the table. This also goes for the parent table that is passed in: if the width isn't specified, lines will be drawn starting at the initial Y position until the first `nil` line is encountered. Any negative number (or `nil` with a width argument) can be used to represent transparency.

To retrieve pixels from the screen after drawing, you can use `term.getPixel(x, y)` to read the color value of one pixel, or `term.getPixels(x, y, w, h)` to read a region of the screen. `term.getPixels` returns a table of `h` rows, where each row is a table of `w` color values. In 16-color mode, color values will be constants from the `colors` table. In 256-color mode, they will be palette indices. Like the other pixel functions, they are zero-based.

In 256-color mode, the first 16 colors are set to the default ComputerCraft palette, but the rest are unset. To take advantage of all of the colors available, the `term.setPaletteColor` function is used to set the remaining colors as needed.

The `paintutils` API supports graphics mode in the same way as usual. All `paintutils` functions can be used in graphics mode, drawing pixels instead of color characters.

## Working with large amounts of pixels
As of CraftOS-PC v2.5, more batch operations have been implemented to allow reading and writing large amounts of pixels faster than ever before. On the C side, these operations use optimized `memset` and `memcpy` routines, rather than setting one pixel at a time.

However, in order to allow those optimizations, you must work with data in the correct format. This format is strings, which store one pixel per byte, and may store many bytes in a row for `memcpy`. Generally, you will find pixel functions a couple orders of magnitude faster when operating on strings rather than tables, as they do not have to coax individual values out of Lua and set one pixel at a time.

* One of the most basic batch operations, and one that deserves special mention, is the solid color fill. As of v2.5, `term.drawPixels` accepts a color constant (or palette index in 256-color mode) as its third argument. This switches it to solid-fill mode, which requires all five arguments (x, y, color, width, height). When called correctly, it will fill an entire region of pixels with a solid color.

* `term.drawPixels` was introduced in v2.2 and allows drawing many pixels to the screen at once. However, in v2.5, another function was introduced to go along with it: `term.getPixels`. This allows you to read large regions of the screen at once, which can then be quickly drawn back at any point with `term.drawPixels`.

* In v2.5.1, `term.getPixels` got an optional fifth argument, which can be set to `true` to return strings instead of nested tables. It is **strongly recommended** that you always specify this argument if you are using `getPixels` for buffering purposes or for moving portions of the screen around. It makes the function about 100 times faster! The argument is ignored in v2.5.

* While performing batch operations can be much faster than the alternative, you can still get flickering caused by the drawing not being completed by the end of the frame. v2.5.1 introduced a pair of functions that allow you to *freeze* the screen, which is a way to prevent the new frame from being displayed until you are done drawing it.

  The two freezing functions are `term.setFrozen(boolean)` and `term.getFrozen()`. While the terminal is frozen, updates will not be drawn on-screen. You can freeze the terminal (`term.setFrozen(true)`) before you draw, and then unfreeze (`term.setFrozen(false)`) it once you are completely done drawing.
