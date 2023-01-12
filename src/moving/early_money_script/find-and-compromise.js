/** @param {NS} ns */

// find and compromise all possible servers 
// and write them and already compromised server to root.txt
export async function main(ns) {
	const weak = [];
	const root = [];

	// get all servers
	const all_servers = JSON.parse(ns.read("all-servers.txt"));

	// go through each server and find if they're weak or root
	for (var server of all_servers) {
		if (is_weak(ns, server)) {
			if (ns.hasRootAccess(server)) {
				root.push(server)
			}
			else {
				weak.push(server);
			}
		}
	}
	ns.write("root.txt", JSON.stringify(root), "w");

	for (var target of weak) {
		let pid = ns.run("compromise.js", 1, target);
		while (ns.isRunning(pid)) { await ns.sleep(100); }
	}
}

function is_weak(ns, server) {
	// 2 var for NUKE
	// 1) hacking level
	var hacking_level = ns.getHackingLevel();
	var server_level = ns.getServerRequiredHackingLevel(server);
	// 2) ports open
	var server_ports = ns.getServerNumPortsRequired(server);
	// calculate nb of ports the player can open
	var player_port = 0;
	if (ns.fileExists("BruteSSH.exe")) {
		player_port++;
	}
	if (ns.fileExists("FTPCrack.exe")) {
		player_port++;
	}
	if (ns.fileExists("relaySMTP.exe")) {
		player_port++;
	}
	if (ns.fileExists("HTTPWorm.exe")) {
		player_port++;
	}
	if (ns.fileExists("SQLInject.exe")) {
		player_port++;
	}

	// logic
	if (server == "home" || server == "darkweb"){
		return false;
	}
	else if (/*hacking_level >= server_level && */ player_port >= server_ports) {
		return true;
	}
	return false;
}