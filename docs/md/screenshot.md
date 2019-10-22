# Screenshots & Recording
CraftOS-PC includes built-in screenshot and GIF recording support. This allows you to take screenshots and videos of the CraftOS terminal at any time, which can be useful when demonstrating a program. It also doesn't require any external tools such as Snipping Tool or `recgif`.

## Taking screenshots
A screenshot can be captured by pressing the F2 button. The resulting image will be saved in `.craftos/screenshots` in your home folder, with a file name with the time and date. The image is saved in PNG format, ready to be viewed on the Internet or edited in a photo editor. `term.screenshot([path])` can also be used to take a screenshot, optionally accepting a global (NOT inside CraftOS) path specifying where to save the resulting capture.

## Recording videos
Recordings can be taken by pressing the F3 key. A red circle will appear in the corner of the window, indicating the screen is being recorded:

![Recording](../images/recording.png)

To stop recording, press F3 again and the recording will be saved in `.craftos/screenshots` in your home folder, with a file name with the time and date. The recording is saved as a GIF, which can easily be posted to a GIF-hosting website such as Imgur.

## Note about `ignoreHotkeys`
When the config option `ignoreHotkeys` is set to true, F2 and F3 will no longer take screenshots or recordings.