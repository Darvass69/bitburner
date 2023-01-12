/** @param {NS} ns */
// same as run on roots, but only works on home
// in the early stage, I kept home prety empty to be able to test scripts easily

export async function main(ns) {
	var script = "dogecoin.js"; // ns.arg[0];
	var server = "home"

	// target-doge.txt = [target, moneyThresh, securityThresh]
	const target_stats = JSON.parse(ns.read("target-doge.txt"));

	// start as many doge as possible
	var thread_count = count_thread(ns, script, server);
	ns.tprint(server + " " + thread_count);
	ns.exec(script, server, thread_count, target_stats[0], target_stats[1], target_stats[2]);
}

// count the number of thread for a file on a server
function count_thread(ns, script, server) {
	var script_ram = ns.getScriptRam(script);
	var server_ram = ns.getServerMaxRam(server);
	var used_ram = ns.getServerUsedRam(server);
	var thread_count = Math.floor((server_ram - used_ram - 10) / script_ram);
	return thread_count;
}