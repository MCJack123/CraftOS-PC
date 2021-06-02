# Raw Mode
CraftOS-PC v2.3 adds a brand new raw output mode that allows sending the entire terminal state in a plain text format that can be easily decoded. This can be used, for example, in a web client that talks to a server to render.

## Raw mode in CraftOS-PC
The `--raw` command-line flag tells CraftOS-PC to output in raw mode. This data is encoded in Base64 with some extra header data around it. (See below for details on the format.) CraftOS-PC also has a renderer for raw mode that can be activated with the `--raw-client` flag (note that this only works with the GUI renderer due to technical limitations). To get full two-way functionality between client and server, both the input and output must be piped together (a simple `server | client` pipe won't work). On Unix-like systems, this can be accomplished using a FIFO with `mkfifo tmp.fifo`, then `craftos --raw < tmp.fifo | craftos --raw-client > tmp.fifo`.

# Official CraftOS-PC Raw Mode Protocol Specification

**CraftOS-PC Raw Mode Protocol, version 1.1**  
**June 1, 2021**

## 1. Introduction

The CraftOS-PC raw mode protocol was developed as a way to efficiently carry the contents of a ComputerCraft terminal over multiple types of transmission media. This includes, but is not limited to, terminal I/O, WebSockets, and TCP sockets.

One of the main optimizations in the raw mode protocol is that terminal data is sent with run-length encoding to reduce size. Because the screen is often filled with blocks of repeated data (like spaces), these are shortened to save space in transit.

Because raw mode was designed for CraftOS-PC, it natively supports special features such as graphics mode. Some clients MAY not support these features, however. If so, the client may choose to not display unsupported data; but they MUST not complain or error out if they receive it. The best course of action would be to display a blank screen, or ignore the packet entirely.

### 1.1. Conventions

The text of this document is formatted for display in a Markdown viewer. As such, it uses formatting controls defined by the language, such as \*\*emphasis\*\* and tables. However, a Markdown reader is not required to view this document, and it should remain human-readable even as plain text.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

## 2. Packet specification

The protocol consists of individual "packets" of data. These packets convey a single piece of information encoded in a binary format. Each packet consists of a magic number for identification, a size encoded in hexadecimal, the payload encoded with Base64 (to allow transmission over non-8-bit-clean media), a CRC-32 checksum, and an ending newline to terminate the packet and to flush the output device.

Packets belong to a specific window ID. A server may have multiple windows open, and clients can listen for and send to window IDs they know about and want to interact with. Multi-window support allows using peripherals that use windows to be available over the same connection. However, clients are not required to support multiple windows, and they may choose to only interact with a single window instance.

### 2.1. Standard packet format

This describes the format of most raw mode packets. These packets MUST be supported by all clients and servers.

| Offset   | Bytes | Purpose |
|----------|-------|---------|
| 0x00     | 4     | Magic number `!CPC` |
| 0x04     | 4     | Hexadecimal-encoded size of the Base64-encoded payload (in bytes) - up to 65535 bytes |
| 0x08     | *x*   | Base64-encoded payload (see section 3-4 for types) |
| 0x08+*x* | 8     | Hexadecimal-encoded CRC32 checksum of encoded payload |
| 0x10+*x* | 1\|2  | New line/line feed character (ASCII code 10) - this MAY be preceded by a carriage return (ASCII code 13) |

Numerical values are represented as hexadecimal values written in ASCII text, with the most significant digit first. Implementors MAY choose to encode digits A-F using either capital or lowercase letters, and MUST be able to decode using either capitalization style.

The payload is encoded in Base64 as specified in RFC 4648. The checksum is calculated with the IEEE-specified CRC-32 polynomial (`0x04C11DB7`).

Note that the CRC-32 is calculated on the already encoded payload, rather than the decoded payload. If binary checksum support is enabled (see section 3.8.1), this will be based on the decoded binary data instead.

### 2.2. Large-size packet format

This format is introduced with raw mode version 1.1, and is nearly the same as the standard format but has a larger size field to support up to 2^48-1 bytes of encoded data.

Implementors SHOULD NOT use this format for packets smaller than 65536 bytes, as it is not supported by protocol version 1.0. In addition, they MUST NOT send this type of format unless both ends have sent Type 6 packets (see section 3.8).

| Offset   | Bytes | Purpose |
|----------|-------|---------|
| 0x00     | 4     | Magic number `!CPD` |
| 0x04     | 12    | Hexadecimal-encoded size of the Base64-encoded payload (in bytes) - up to 2^48-1 bytes |
| 0x10     | *x*   | Base64-encoded payload (see section 3 for types) |
| 0x10+*x* | 8     | Hexadecimal-encoded CRC32 checksum of encoded payload |
| 0x18+*x* | 1\|2  | New line/line feed character (ASCII code 10) - this MAY be preceded by a carriage return (ASCII code 13) |

## 3. Data specification

This section describes the format of the binary payload for each packet. This is the data that is encoded in Base64 in each packet.

Any field marked as "Reserved" MUST be set to 0, and receivers MUST allow these fields to be non-zero if later versions use that field, ignoring their contents.

### 3.1. Common header

All packets contain two bytes at the beginning of the data. The first byte contains the type of packet that is being sent. The types available are listed below. The second byte contains the ID of the window this packet belongs to.

If a packet with an unknown type is received, the receiver MUST ignore the packet entirely. In addition, a packet MAY be longer than is expected - if so, the receiver MUST ignore the bytes beyond the expected end of the data.

A server MUST NOT send packets for windows that do not exist; i.e. a Type 4 packet has not been sent registering a window, or a Type 4 packet requested the closure of the window. If a receiver is not aware of the existence of a specified window ID, it MUST ignore the packet (unless the packet is a Type 4 requesting window open).

The format of each data type is listed below. Note that the offsets are relative to the beginning of the packet data, which includes the packet type & window ID.

### 3.2. Type 0: Terminal contents

This packet type is used to send whole terminal contents from the server to the client. This packet MUST only be sent from a server.

| Offset     | Bytes      | Purpose
|------------|------------|-----------
| 0x02       | 1          | Graphics mode status
| 0x03       | 1          | Cursor blinking? (previously showing)
| 0x04       | 2          | Width
| 0x06       | 2          | Height
| 0x08       | 2          | Cursor X
| 0x0A       | 2          | Cursor Y
| 0x0C       | 1          | Grayscale? (1 = grayscale, 0 = color) -- if grayscale, render colors with (r + g + b) / 3
| 0x0D       | 3          | Reserved

#### 3.2.1. Terminal data

If the graphics mode field is set to 0, this data follows:

| Offset     | Bytes      | Purpose
|------------|------------|-----------
| 0x10       | *x*        | RLE-encoded text (length of expanded RLE = width * height)
| 0x10 + x   | *y*        | RLE-encoded background pairs (high nybble = BG, low nybble = FG)

If the graphics mode field is set to 1 or 2, this data follows:

| Offset     | Bytes      | Purpose
|------------|------------|-----------
| 0x10       | *x*        | RLE-encoded pixel data (length of expanded RLE = width * height * 54)

#### 3.2.2. Palette data

If the graphics mode field is set to 0 or 1, this data follows:

| Offset     | Bytes      | Purpose
|------------|------------|-----------
| 0x10+x[+y] | 48         | RGB palette x16

If the graphics mode field is set to 2, this data follows:

| Offset     | Bytes      | Purpose
|------------|------------|-----------
| 0x10+x     | 768        | RGB palette x256

#### 3.2.3. Notes

The graphics modes defined as of version 1.1 include 0 (text mode), 1 (16-color graphics mode), and 2 (256-color graphics mode). A client MUST ignore the packet if this value is set to an unknown value.

The width and height fields are specified in character cells. The total size of the RLE-encoded data MUST be (width) * (height) (in graphics mode, * 54).

Previous versions of the raw mode protocol used the cursor blinking field to store whether the cursor was showing instead. Version 1.1 moves the responsibility of blinking the cursor to the client instead of the server. Since connections default to version 1.0 behavior unless a Type 6 packet is sent (see section 3.8), this field SHOULD be used for cursor showing until the server and client have exchanged capabilities. (This indicates that both client and server support version 1.1 or later.) 

The run-length encoding technique employed by the raw mode protocol uses a sequence of two-byte pairs to describe the data. The first byte consists of the byte to repeat, and the second byte holds the number of repetitions of the byte. For example, a pair holding `'a' 3` would result in `"aaa"`. The number of pairs to read is determined by the width and height of the packet.

Here is a simple algorithm to decode the RLE format, written in C:

```c
unsigned char c = getc();
unsigned char n = getc();
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        screen[y][x] = c;
        if (--n == 0) {
            c = getc();
            n = getc();
        }
    }
}
```

Successful RLE decoding SHOULD NOT result in any extra bytes at the end; i.e. `n` should always be equal to 0 at the end. When this is true, the above algorithm will result in `c` and `n` being set to the first two bytes of the next field. However, clients MUST NOT break (e.g. crash, corrupt memory) if a packet with an invalid RLE encoding is sent, and they MAY choose to ignore the packet if the size is not correct.

### 3.3. Type 1: Key event data

This packet type sends a key event in an efficient format. This type MUST only be sent from the client to the server.

| Offset     | Bytes      | Purpose
|------------|------------|---------------
| 0x02       | 1          | Key ID (as in keys API) or character (depending on bit 3 of flags)
| 0x03       | 1          | Bit 0 = key (1) or key_up (0), bit 1 = is_held, bit 2 = control held, bit 3 = character (1) or key (0)

Key IDs use the original ComputerCraft mappings, which are nearly equivalent to PS/2 Scan Code Set 1.

<details>
<summary>Mappings between IDs and <code>keys</code> API constants</summary>

| ID | Name |
|----|------|
| 2 | `one` |
| 3 | `two` |
| 4 | `three` |
| 5 | `four` |
| 6 | `five` |
| 7 | `six` |
| 8 | `seven` |
| 9 | `eight` |
| 10 | `nine` |
| 11 | `zero` |
| 12 | `minus` |
| 13 | `equals` |
| 14 | `backspace` |
| 15 | `tab` |
| 16 | `q` |
| 17 | `w` |
| 18 | `e` |
| 19 | `r` |
| 20 | `t` |
| 21 | `y` |
| 22 | `u` |
| 23 | `i` |
| 24 | `o` |
| 25 | `p` |
| 26 | `leftBracket` |
| 27 | `rightBracket` |
| 28 | `enter` |
| 29 | `leftCtrl` |
| 30 | `a` |
| 31 | `s` |
| 32 | `d` |
| 33 | `f` |
| 34 | `g` |
| 35 | `h` |
| 36 | `j` |
| 37 | `k` |
| 38 | `l` |
| 39 | `semiColon` |
| 40 | `apostrophe` |
| 41 | `grave` |
| 42 | `leftShift` |
| 43 | `backslash` |
| 44 | `z` |
| 45 | `x` |
| 46 | `c` |
| 47 | `v` |
| 48 | `b` |
| 49 | `n` |
| 50 | `m` |
| 51 | `comma` |
| 52 | `period` |
| 53 | `slash` |
| 54 | `rightShift` |
| 55 | `multiply` |
| 56 | `leftAlt` |
| 57 | `space` |
| 58 | `capsLock` |
| 59 | `f1` |
| 60 | `f2` |
| 61 | `f3` |
| 62 | `f4` |
| 63 | `f5` |
| 64 | `f6` |
| 65 | `f7` |
| 66 | `f8` |
| 67 | `f9` |
| 68 | `f10` |
| 69 | `numLock` |
| 70 | `scrollLock` |
| 71 | `numPad7` |
| 72 | `numPad8` |
| 73 | `numPad9` |
| 74 | `numPadSubtract` |
| 75 | `numPad4` |
| 76 | `numPad5` |
| 77 | `numPad6` |
| 78 | `numPadAdd` |
| 79 | `numPad1` |
| 80 | `numPad2` |
| 81 | `numPad3` |
| 82 | `numPad0` |
| 83 | `numPadDecimal` |
| 87 | `f11` |
| 88 | `f12` |
| 100 | `f13` |
| 101 | `f14` |
| 102 | `f15` |
| 111 | `kana` |
| 121 | `convert` |
| 123 | `noconvert` |
| 125 | `yen` |
| 141 | `numPadEquals` |
| 144 | `circumflex` |
| 145 | `at` |
| 146 | `colon` |
| 147 | `underscore` |
| 148 | `kanji` |
| 149 | `stop` |
| 150 | `ax` |
| 156 | `numPadEnter` |
| 157 | `rightCtrl` |
| 179 | `numPadComma` |
| 181 | `numPadDivide` |
| 184 | `rightAlt` |
| 197 | `pause` |
| 199 | `home` |
| 200 | `up` |
| 201 | `pageUp` |
| 203 | `left` |
| 205 | `right` |
| 207 | `end` |
| 208 | `down` |
| 209 | `pageDown` |
| 210 | `insert` |
| 211 | `delete` |
</details>

### 3.4. Type 2: Mouse event data

This packet type sends a mouse event in an efficient format. This type MUST only be sent from the client to the server.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Event type: 0 = mouse_click, 1 = mouse_up, 2 = mouse_scroll, 3 = mouse_drag
| 0x03       | 1          | Button ID, or scroll direction (0 = up, 1 = down)
| 0x04       | 4          | X position (character in mode 0, pixel in mode 1/2)
| 0x08       | 4          | Y position

### 3.5. Type 3: Generic event data

This packet type sends a generic event to be queued on the computer. This type MUST only be sent from the client to the server.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Number of parameters
| 0x03       | *x*        | Event name (NUL-terminated)
| 0x03+x     | *y*        | List of serialized Lua values

#### 3.5.1. Serialized Lua value format

Type 3 uses a compact binary format to serialize Lua values. This allows sending arbitrary data to be decoded straight into the event queue.

The first byte specifies the type of data stored in the value.

* If the type is 0, the value is an unsigned 32-bit integer, and 4 bytes follow with the value.
* If the type is 1, the value is a double-precision float, and 8 bytes follow with the value.
* If the type is 2, the value is a boolean value, and a single byte follows, with 0 indicating `false` and any non-zero value (which SHOULD be 1) indicating `true`.
* If the type is 3, the value is a string, and a variable number of bytes follows, with the end of the string indicated with a NUL (0) byte.
* If the type is 4, the value is a compound table. The first byte to follow indicates the number of entries in the table. Then a list of keys follows, with the number of keys indicated by the entry count. Each key is its own serialized value, so read it the same way as its parent. (A recursive function is a good way to implement this.) Finally, a list of values follows the keys.
* Any other type SHOULD be unserialized as `nil`, except 5 which MUST be `nil`.

### 3.6. Type 4: Terminal change

This packet is used to communicate changes in terminal windows, including opening new windows, resizing, title changes, and closing. Both clients and servers MAY send these packets.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Set to 1 when closing window or 2 when quitting program
| 0x03       | 1          | Computer ID (see below)
| 0x04       | 2          | Width
| 0x06       | 2          | Height
| 0x08       | *x*        | Title (NUL-terminated) (ignored when sending client -> server)

If the "closing" field is set to any non-zero value, all other fields MUST be ignored.

The computer ID field was previously reserved on version 1.0. As such, it should not necessarily be relied on. Depending on the value of the field, these scenarios may occur:
* If opening a window and this is > 0, provides the ID + 1 of the computer this references (Version 1.1+)
* If opening a window and this is = 0, either the window is a monitor or this field is not supported
* If not opening a window, this field is ignored

The title field MAY be ignored if the client or server does not support showing window titles. However, servers SHOULD set a title for clients that do support titles. For example, a simple server could set the title for all windows to "Raw Terminal" or similar.

Clients sending this packet SHOULD wait for the server to send a response to change the window's properties or close a window. Servers that receive a Type 4 packet MUST send a Type 4 packet back with the same contents to indicate confirmation of the action.

#### 3.6.1. Window creation and destruction

To indicate a new window's creation, a server MUST send a Type 4 packet, with the "closing" field set to 0, the width and height set to the size of the window, and the title of the window. Clients SHOULD not accept packets from a window ID unless a Type 4 packet has been sent indicating its existence.

When a window is closed, a server SHOULD send a Type 4 packet with the "closing" field set to 1, to indicate to the client that the window has been destroyed. Once a client receives that packet, it SHOULD destroy its representation of the window, and packets for that ID SHOULD no longer be accepted. Note that a future window MAY re-use the ID of a destroyed window.

When a client or server intends to close the connection, it MUST send a Type 4 packet with the "closing" field set to 2. If a server receives this packet, it MUST shut down all windows *and send a Type 4 packet with "closing" set to 2 as well*; then closing the connection. If a client receives this packet, it MUST destroy all client-side windows and close the connection; it does not need to send any packets back.

### 3.7. Type 5: Show message

This packet is used to display a message box on the client. This type MUST only be sent from the server to the client. Servers and clients MAY choose to not implement this packet type, as it assumes an outer window manager that can display messages.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 4          | Flags from SDL message event
| 0x06       | *x*        | Title (NUL-terminated)
| 0x06+x     | *y*        | Message (NUL-terminated)

The flags variable indicates an optional icon/context, and can be one of these values:

* 0: No context
* 0x10: Error message
* 0x20: Warning message
* 0x40: Informational message

### 3.8. Type 6: Version support flags

This packet is used to negotiate common extended features between a client and a server. Both clients and servers MAY send these packets.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 2          | Standard flags as a bitfield - each bit represents a supported feature
| [0x04]     | [4]        | Extended flags as a bitfield - only available if bit 15 of standard flags is set

When a client supporting Type 6 packets connects to a server, it SHOULD send a Type 6 packet with its capabilities. If a server receives a Type 6 packet and knows about its existence, it MUST send back a packet specifying its capabilities. If the client or server doesn't send or receive a Type 6 packet, both parties MUST assume no extended capabilities are supported.

Before the server sends back a response, both parties MUST communicate using no extended features. Once the server sends back a response, both the server and client MUST communicate using the common capabilities between the two. (A way to determine common capabilities is through a bitwise AND of the support flags.)

#### 3.8.1. Available feature flags

* 0: Binary data CRC-32 checksum support (as opposed to checksumming the Base64 data)
* 1: Filesystem support extension
* 2: Server should send window information about all open windows (see below)
* 3-14: Currently reserved, leave unset
* 15: Set if the extended flags are present (SHOULD be unset for now)

Extended flags:

* 0-31: Currently reserved, leave unset

#### 3.8.2. Notes

If a server receives a Type 6 packet with bit 2 of the standard flags set, it MUST send back one 4 packet for every window that is currently open after sending the Type 6 reply. This is to allow clients to ensure no Type 4 packets were dropped while connecting to the server, since there was no handshake procedure before version 1.1. The state of the flag when sent from the server is undefined, and MAY be set or unset.

To maintain compatibility with version 1.0, implementors that are compatible with 1.1 SHOULD maintain complete compatibility with 1.0 until Type 6 packets have been exchanged. To accomplish this, the following things are not available until then:

* Large-format packets
* Cursor blinking field in Type 0 packets (the field should indicate cursor showing instead)

Once a client and server have exchanged compatibility flags, they SHOULD assume that both ends are compatible with version 1.1, since Type 6 packets are a version 1.1 extension. After then, these will be available for both clients and servers to use.

## 4. Filesystem support extension

The filesystem extension adds support for accessing a computer's files from the remote client. It uses the same function set as ComputerCraft's FS API, but uses three different request/reply packets to communicate data efficiently.

To indicate support for the filesystem extension, set bit 1 of the standard capability flags in a Type 6 packet.

### 4.1. Type 7: File request

This packet type is used to send a request for file information or modification. This type MUST only be sent from the client to the server.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Request type (see below)
| 0x03       | 1          | Unique request ID to be sent back to the client
| 0x04       | *x*        | Path to the file to check (NUL-terminated)
| 0x04+x     | *y*        | For types 12 and 13, the second path (NUL-terminated)

#### 4.1.1. Request types

Request types are based on the functions in the [FS API](https://tweaked.cc/module/fs.html) of the same name. The following request types are available:

* 0: `exists`
* 1: `isDir`
* 2: `isReadOnly`
* 3: `getSize`
* 4: `getDrive`
* 5: `getCapacity`
* 6: `getFreeSpace`
* 7: `list`
* 8: `attributes`
* 9: `find`
* 10: `makeDir`
* 11: `delete`
* 12: `copy`
* 13: `move`

Request types 16-23 are used for file reading and writing. The low 3 bits indicate the mode, with the following bits available:

* Bit 0: read (0)/write (1)
* Bit 1: append? (ignored on read)
* Bit 2: binary?

#### 4.1.2. Notes

The request ID MAY be set to any value, and it SHOULD be unique from all other requests sent (at least from ones that haven't been received yet).

If the packet is a write request, this packet type MUST be followed by a Type 9 File data packet.

If the request is a read operation, the next packet will be a Type 9 packet - no Type 8 packet will be sent.

### 4.2. Type 8: File response

This packet type notifies the client of a file operation's success or failure, and if the operation returns data back, it contains the result of the operation. This type MUST only be sent from the server to the client.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Request type
| 0x03       | 1          | Unique request ID this response belongs to
|            |            | 
|            |            | *Non-returning operations (`makeDir`, `delete`, `copy`, `move`, write operations)*
| 0x04       | *x*        | 0 if success, otherwise a NUL-terminated string containing an error message
|            |            | *Boolean operations (`exists`, `isDir`, `isReadOnly`)*
| 0x04       | 1          | 0 = `false`, 1 = `true`, 2 = error
|            |            | *Integer operations (`getSize`, `getCapacity`, `getFreeSpace`)*
| 0x04       | 4          | The size reported from the function (0xFFFFFFFF = error)
|            |            | *String operations (`getDrive`)*
| 0x04       | *x*        | The path/name of the drive (NUL-terminated, "" = error)
|            |            | *List results (`list`, `find`)*
| 0x04       | 4          | Number of entries in the list (0xFFFFFFFF = error)
| 0x08       | *y*        | List of files, with each string NUL-terminated
|            |            | *Attributes (`attributes`)*
| 0x04       | 4          | File size
| 0x08       | 8          | Creation time (in milliseconds; integer)
| 0x10       | 8          | Modification time (in milliseconds; integer)
| 0x18       | 1          | Is directory?
| 0x19       | 1          | Is read only?
| 0x1A       | 1          | Error flag (0 = ok, 1 = does not exist, 2 = error)
| 0x1B       | 1          | Reserved

The contents of the response differ depending on the request type. Before reading the rest of the data, check the request type to know what data to read.

The request ID MUST have the same value as the ID sent in the request for this operation.

### 4.3. Type 9: File data

This packet is used to transfer file data for a file read/write operation. This type MAY be sent from either the client or the server.

| Offset     | Bytes      | Purpose
|------------|------------|------------
| 0x02       | 1          | Set to 1 if an error occurred while accessing the file; an error message will be sent as file data if set
| 0x03       | 1          | Unique request ID this response belongs to
| 0x04       | 4          | Size of the data, in bytes
| 0x08       | *x*        | File data

The request ID MUST have the same value as the ID sent in the request for this operation.

It is recommended that this packet be sent in the large-format style (see section 2.2) to avoid the possibility of sending files that are too big for the packet. (The maximum size of a standard encoded payload is 65535 bytes, and accounting for Base64's size expansion, the decoded payload can only be about 49151 bytes in size.)

### 4.4. Details on file read/write operations

Read and write operations (file request types 16-23) do not follow the same pattern as other operations, which simply return a Type 8 packet on operation completion. They use Type 9 packets to transfer file data, and on write operations a Type 8 packet is sent to indicate completion.

When a read request is sent from the client, the server MUST respond with a single Type 9 packet. This will contain the file data, or if an error occurred while opening the file (such as the file not existing), an error message describing the reason.

When a write request is sent, the client MUST send a Type 9 packet with the same request ID as the Type 7 request immediately after sending the request. The server then MUST respond with a Type 8 packet in the "non-returning operations" format on completion.

The server MAY choose to send a Type 8 packet after a timeout if no Type 9 packet is received with the data. If this occurs, the client MUST send a new request packet as the previous request will be invalidated. The server MAY also choose to either use the request ID to pair request and data, or it MAY use the last Type 7 packet as the request (checking that the request IDs are the same).

All file data sent is binary data (specifically, in CC's 8-bit character set). When the binary flag is unset, data is encoded to UTF-8 on disk; otherwise data is read/written as-is.

## 5. Typical client <-> server interaction

This example assumes a server that has one window that opens before/on startup.

Once the connection between the client and server is established, the server sends a Type 4 packet to notify the client of the creation of window 0. At the same time, the client sends a Type 6 packet with a set of its supported features.

Once the server receives the Type 6 packet, it sends a Type 6 packet with the capabilities it supports. If the client set bit 2, it then sends a Type 4 packet for window 0.

Now that the capabilities have been exchanged and the client is aware of the windows, it can start accepting updates. The server sends Type 0 packets with the contents of each rendered frame, and the client parses them and renders to its representation of the window.

Occasionally, the client receives keystrokes from the user and sends Type 1 packets with the contents of the key stroke. For example, when the 'a' key is pressed, the following packets are sent:

* Character = 30, flags = 1 (`key 30 false`)
* Character = 97, flags = 9 (`char a`)
* On release: character = 30, flags = 0 (`key_up 30`)

Mouse events may also be sent in Type 2 packets. If the client receives a paste event, it sends a Type 3 packet with a `paste` event name, and one parameter with type 3 and the contents of the pasteboard.

Once the client's window receives a close event from the user, it sends a Type 4 packet with the closing field set to 1 to the server. The server then sends a Type 4 packet back indicating the window's closure, and the client can close the window. If the window was the last window open, the server then sends a Type 4 packet with closing set to 2, indicating that the server is closing and that the connection will be ended. The server and client then disconnect from each other, and communication ends.

## Appendix A: CraftOS-PC version support

This section lists the versions of the raw mode protocol that various versions of CraftOS-PC support.

| CraftOS-PC versions | Raw protocol version |
|---------------------|----------------------|
| v2.2.6 and below    | No raw mode support  |
| v2.3 - v2.4         | 1.0 (without grayscale field in Type 0) |
| v2.4.1 - v2.5.5     | 1.0                  |
| v2.5.6 - Current    | 1.1                  |
