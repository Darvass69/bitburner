/** @param {NS} ns */

// return an array of all the servers
export function Find_servers(ns) {
	const all_server_list = [];
	// start with home
	var server_list = ns.scan("home");

	// find all neighbors and their neighbors and their ..., add them to a list
	while (server_list.length > 0) {
		all_server_list.push(server_list[0]);

		// scan servers around
		var new_server = ns.scan(server_list[0]);

		// remove previous server from the list
		new_server.shift();
		server_list.shift();

		// add new server to the list
		server_list = server_list.concat(new_server);
	}
	return all_server_list;
}


// returns an array of all the foreign servers
export function Find_and_compromise(ns, all_servers) {
	const weak = [];
	const admin = [];

	// go through each server and find if they're weak or admin
	for (var server of all_servers) {
		if (Is_weak(ns, server)) {
			if (ns.hasRootAccess(server)) {
				admin.push(server)
			}
			else {
				weak.push(server);
			}
		}
	}

	for (var target of weak) {
		admin.push(Compromise(ns, target))
	}
	return admin;
}

function Is_weak(ns, server) {
	// ports open
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
	else if (player_port >= server_ports) {
		return true;
	}
	return false;
}

function Compromise(ns, target) {
	// open ports
	if (ns.fileExists("BruteSSH.exe")) {
		ns.brutessh(target)
	}
	if (ns.fileExists("FTPCrack.exe")) {
		ns.ftpcrack(target)
	}	
	if (ns.fileExists("relaySMTP.exe")) {
		ns.relaysmtp(target)
	}
	if (ns.fileExists("HTTPWorm.exe")) {
		ns.httpworm(target)
	}
	if (ns.fileExists("SQLInject.exe")) {
		ns.sqlinject(target)
	}

	// nuke
	ns.nuke(target);
	return target;
}


// returns the RAM of all the admin servers in the form:{server1: RAM, server2: RAM, ... }
export function Get_RAM(ns, accessible_servers) {
	let all_RAM = {};
	// iterate servers in accessible_servers
	for (let server of accessible_servers){
		let server_RAM = ns.getServerMaxRam(server);
		if (server_RAM > 0){
			all_RAM[server] = server_RAM;
		}
	}
	return all_RAM;
}