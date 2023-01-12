// from https://www.reddit.com/r/Bitburner/comments/wwukoc/quick_reference_script_to_all_colors_printed_to/ 

/**
 * Updated for game version 2.1.0: attributes 40-47 have been deprecated, use palette indices 8 to 15 (inclusive) instead.
 */

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog(`ALL`); // Failures are still logged, this just prevents unnecessary spam.

	ns.tprintf(`\x1b[1;35mUsing colors in script output with \x1b[1;36mtprint\x1b[1;35m & \x1b[36;1mtprintf\x1b[1;35m (terminal) and \x1b[36;1mprint\x1b[1;35m & \x1b[1;36mprintf\x1b[1;35m (log)`);

	ns.tprintf(`\n`);

	ns.tprintf(`\x1b[1;36m• Using a 4-letter all-CAPS keyword at the start (4 colors)`)
	ns.tprintf(`       green foreground  ─ #00cc00 /   0,204,  0 (default color, you could use "OKAY" for alignment with other keywords)`);
	ns.tprintf(`INFO ─ blue foreground   ─ #3366cc /  51,102,204 (only the first 4 characters matter, e.g. "INFORMATION" also works`);
	ns.tprintf(`WARN ─ yellow foreground ─ #cccc00 / 204,204,  0 (same story, e.g. "WARNING" can also be used)`);
	ns.tprintf(`FAIL ─ red foreground    ─ #cc0000 / 204,  0,  0 ("ERROR" also works, making it the only 5-letter keyword)`);

	ns.tprintf(`\n`);

	// Implemented attribute numbers in Bitburner: 0, 1, 4, 30-37, 38;5, 48;5
	ns.tprintf(`\x1b[1;36m• Using an ANSI escape sequence`);
	ns.tprintf(`Syntax: \x1b[36m\\x1b[\x1b[35mn\x1b[36mm\x1b[m, replace \x1b[35mn\x1b[m by display attribute(s). Several attributes can be set in the same sequence, separated by semicolons.`);
	ns.tprintf(` 0     ─ \x1b[mall attributes off ─ equivalent to using an empty escape sequence: \x1b[36m\\x1b[m\n`);
	ns.tprintf(` 1     ─ \x1b[1mbold text ─ bold characters are wider, so they don't line up with normal text.\n`);
	ns.tprintf(` 4     ─ \x1b[4munderline ─ \x1b[4;31msame \x1b[4;33mcolor \x1b[4;35mas \x1b[4;36mthe \x1b[4;37mtext.\n`);

	ns.tprintf(`\n`);

	ns.tprintf(`\x1b[1;36m• Basic colors`)
	let palette4bit = ``;
	palette4bit += `30-37  ─ 8 foreground colors:`;
	for (let i = 30; i <= 37; i++) {
		palette4bit += `\x1b[${i}m ${i} \x1b[m`;
	}
	palette4bit += `\n`;
	palette4bit += `40-47  ─ 8 background colors: \x1b[33mdeprecated since game version 2.1.0, use palette indices 8 to 15 (inclusive) instead`;
	palette4bit += `\n`;
	ns.tprintf(palette4bit);

	ns.tprintf(`\n`);

	ns.tprintf(`\x1b[1;36m• 256 color palette`);
	let palette8bit = ``;
	palette8bit += `38;5;\x1b[35mn\x1b[m ─ Set foreground color to palette index \x1b[35mn\x1b[m\n`;
	palette8bit += `48;5;\x1b[35mn\x1b[m ─ Set background color to palette index \x1b[35mn\x1b[m\n`;
	palette8bit += `\n`;
	// 16 basic colors (indices 0 to 15 inclusive)
	for (let i = 0; i < 16; i++) {
		if (i === 0 || i === 1 || i === 4 || (i >= 8 && i <= 14)) { // Use light text for better contrast of index against background.
			palette8bit += `\x1b[37;48;5;${i}m${String(i).padStart(9)}\x1b[m`;
		} else { // Use dark text for better contrast of index against background.
			palette8bit += `\x1b[30;48;5;${i}m${String(i).padStart(9)}\x1b[m`;
		}
	}
	palette8bit += `\n\n`;
	// 216 colors (6×6×6 cube) (indices 16 to 231 inclusive)
	for (let i = 0; i < 6; i++) {
		for (let j = 16; j <= 51; j++) {
			let n = i * 36 + j; // n = i * rowlength + j
			if (j < 34) {
				palette8bit += `\x1b[37;48;5;${n}m${String(n).padStart(4)}\x1b[m`;
			} else {
				palette8bit += `\x1b[30;48;5;${n}m${String(n).padStart(4)}\x1b[m`;
			}
		}
		palette8bit += `\n`;
	}
	palette8bit += `\n`;
	// 24 grayscale colors (indices 232 to 255 inclusive)
	for (let i = 232; i <= 255; i++) {
		if (i < 244) {
			palette8bit += `\x1b[37;48;5;${i}m${String(i).padStart(6)}\x1b[m`;
		} else {
			palette8bit += `\x1b[30;48;5;${i}m${String(i).padStart(6)}\x1b[m`;
		}
	}
	ns.tprintf(palette8bit);
}