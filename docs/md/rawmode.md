# Raw Mode
CraftOS-PC v2.3 adds a brand new raw output mode that allows sending the entire terminal state in a plain text format that can be easily decoded. This can be used, for example, in a web client that talks to a server to render.

## Raw mode in CraftOS-PC
The `--raw` command-line flag tells CraftOS-PC to output in raw mode. This data is encoded in Base64 with some extra header data around it. (See below for details on the format.) CraftOS-PC also has a renderer for raw mode that can be activated with the `--raw-client` flag (note that this only works with the GUI renderer due to technical limitations). To get full two-way functionality between client and server, both the input and output must be piped together (a simple `server | client` pipe won't work). On Unix-like systems, this can be accomplished using a FIFO with `mkfifo tmp.fifo`, then `craftos --raw < tmp.fifo | craftos --raw-client > tmp.fifo`.

## Raw mode data specification
Data sent in raw mode follows a specific general format:
1. Magic number for identification: `!CPC`
2. Size of encoded payload as 16-bit hex string (`00AB`)
3. Base64-encoded payload
4. CRC-32 checksum of encoded payload as 32-bit hex string (`B91FAB73`)

In the payload, there are two common fields each one byte wide: the type of payload that is contained, and the ID of the window it is for.

Here are the specifications for each type of payload:

### Type 0: Terminal contents (server -> client)

| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 1         | Graphics mode |
| 0x03      | 1         | Cursor showing? |
| 0x04      | 2         | Width |
| 0x06      | 2         | Height |
| 0x08      | 2         | Cursor X |
| 0x0A      | 2         | Cursor Y |
| 0x0C      | 4         | Reserved |
| | | **Screen data** |
| | | *Text mode (mode 0)* |
| 0x10      | *x*       | RLE-encoded text (length of expanded RLE = width * height) |
| 0x10 + *x*  | *y*       | RLE-encoded background pairs (high nybble = BG, low nybble = FG) |
| | | *Graphics modes (modes 1/2)* |
| 0x10      | *x*       | RLE-encoded pixel data (length of expanded RLE = width * height * 54) |
| | | **End screen data** |
| | | **Palette** |
| | | *Text mode / 16 color GFX mode (modes 0/1)* |
| 0x10 + *x* \[+ *y*\]| 48        | RGB palette x16 |
| | | *256 color GFX mode (mode 2)* |
| 0x10 + *x*    | 768       | RGB palette x256 |
| | | **End palette** |

### Type 1: Key event data (client -> server)

| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 1         | Key ID (as in keys API) or character (depending on bit 3 of flags) |
| 0x03      | 1         | Bit 0 = key (1) or key_up (0), bit 1 = is_held, bit 2 = control held, bit 3 = character (1) or key (0) |

### Type 2: Mouse event data (client -> server)

| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 1         | Event type: 0 = mouse_click, 1 = mouse_up, 2 = mouse_scroll, 3 = mouse_drag |
| 0x03      | 1         | Button ID, or scroll direction (0 = up, 1 = down) |
| 0x04      | 4         | X position (character in mode 0, pixel in mode 1/2) |
| 0x08      | 4         | Y position |

### Type 3: Generic event data (client -> server)
  
| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 1         | Number of parameters |
| 0x03      | *x*       | Event name (NUL-terminated) |
| | | **Event parameters** |
| 0x00      | 1         | Data type: 0 = 32-bit integer, 1 = double, 2 = boolean, 3 = string, 4 = table, 5 = nil (no data after type) |
|   0x01    | 4         | Type 0: Integer data |
|   0x01    | 8         | Type 1: Double data |
|	0x01    | 1         | Type 2: Boolean data |
|	0x01    | *y*       | Type 3: String data (NUL-terminated) |
|	| | *Type 4: Table data* |
|	0x01    | 1         | Number of entries |
|	0x02    | *a*       | Key data (same as parameter data) |
|	0x02 + *a* | *b*       | Value data (same as parameter data) |
|	| | *End type 4: table data* |
| | | **End event parameters** |

### Type 4: Terminal change (use this to detect new windows) (either -> either)
	
| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 1         | Set to 1 when closing window or 2 when quitting program (if so, other fields may be any value) |
| 0x03      | 1         | Reserved |
| 0x04      | 2         | Width |
| 0x06      | 2         | Height |
| 0x08      | *x*       | Title (NUL-terminated) (ignored when sending client -> server but must be present) |

### Type 5: Show message (server -> client)
  
| Offset    | Bytes     | Purpose |
|-----------|-----------|---------|
| 0x02      | 4         | Flags from SDL message event |
| 0x06      | *x*       | Title (NUL-terminated) |
| 0x06 + *x* | *y*       | Message (NUL-terminated) |
