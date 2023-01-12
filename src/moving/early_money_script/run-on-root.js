/** @param {NS} ns */

// copy and run as many thread of doge on all root servers
export async function main(ns) {
	var script = "dogecoin.js"; // ns.arg[0];
	const roots = JSON.parse(ns.read("root.txt"));

	// target-doge.txt = [target, moneyThresh, securityThresh]
	const target_stats = JSON.parse(ns.read("target-doge.txt"));
	ns.tprint(target_stats);

	for (const server of roots) {
		// kill all scripts
		ns.killall(server);

		// replace doge on it
		if (ns.fileExists(script, server)) {
			ns.rm(script, server);
		}
		ns.scp(script, server);

		// start as many doge as possible
		var thread_count = count_thread(ns, script, server);
		if (thread_count > 0){
			ns.tprint(server + " " + thread_count);
			ns.exec(script, server, thread_count, target_stats[0], target_stats[1], target_stats[2]);
		}
	}
}

// count the number of thread for a file on a server
function count_thread(ns, script, server) {
	var script_ram = ns.getScriptRam(script);
	var server_ram = ns.getServerMaxRam(server);
	var thread_count = Math.floor(server_ram / script_ram);
	return thread_count;
}