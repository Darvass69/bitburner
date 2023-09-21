/** @param {NS} ns */
// script to auto-run share() for a % of RAM on a specified server (default is home)
var _ns;
export async function main(ns) {
	_ns = ns;
	var script = "utils/share/share.js";
	let ram_to_use = ns.args[0];

	let server = ns.args[1] ?? "home";
	ns.kill(script, server);

	// start as many share as possible up to ram_to_use %
	let thread_count = count_thread(script, server, ram_to_use);
	ns.tprint(server + " " + thread_count);
	if (server != "home"){
		ns.scp(script, server)
	}
	ns.exec(script, server, thread_count);

	await ns.sleep(250);
	var share_power = ns.getSharePower();
	ns.tprint('Current share power : ', share_power);
}

// count the number of thread for a file on a server
function count_thread(script, server, ram_to_use) {
	var script_ram = _ns.getScriptRam(script);
	var server_ram = _ns.getServerMaxRam(server);
	var used_ram = _ns.getServerUsedRam(server);
	var thread_count = Math.floor((server_ram - used_ram) * (ram_to_use / 100) / script_ram);
	return thread_count;
}