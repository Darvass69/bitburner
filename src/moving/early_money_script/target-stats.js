/** @param {NS} ns */
export async function main(ns) {
	const target_stats = JSON.parse(ns.read("target-doge.txt"));
	ns.tprint("target stats: " + target_stats);

	const current_stats = []
	current_stats[0] = target_stats[0]
	current_stats[1] = ns.getServerMoneyAvailable(target_stats[0])
	current_stats[2] = ns.getServerSecurityLevel(target_stats[0])
	ns.tprint("current stat: " + current_stats);
}