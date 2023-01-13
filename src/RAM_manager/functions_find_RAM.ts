/*
// This is crossed out
! This is red: alert or mark things for debugging (ex: tprint)
? This is blue: questions
& This is pink: main structure
^ This is yellow: structure
~ This is purple: structure
* This is green:
TODO this is orange: todo
*/

//& --------------------------------- Imports -----------------------------------
import { NS } from "@ns";


//& ----------------------------- Declaring Types -------------------------------
export type AllRAM = {[server: string]: number}


//& -------------------------------- Functions ----------------------------------
//^ ------------------------------ Find Servers ---------------------------------
// return an array of all the servers
export function Find_servers(ns: NS): string[]{
	const all_servers: string[] = [];
	// start with home
	let server_list = ns.scan("home");

	// find all neighbors and their neighbors and ..., add them to a list
	while (server_list.length > 0) {
		all_servers.push(server_list[0]);

		// scan servers around
		let new_server = ns.scan(server_list[0]);

		// remove previous server from the list
		new_server.shift();
		server_list.shift();

		// add new server to the list
		server_list = server_list.concat(new_server);
	}
	return all_servers;
}


//^ --------------------------- Find And Compromise -----------------------------
// returns an array of all the foreign servers
export function Find_and_compromise(ns: NS, all_servers: string[]) {
	const weak: string[] = [];
	const admin: string[] = [];

	// go through each server and find if they're weak or admin
	for (let server of all_servers) {
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


//* --------------------------------- Is Weak -----------------------------------
function Is_weak(ns: NS, server: string) {
	// remove home and darkweb
	if (server == "home" || server == "darkweb"){
		return false;
	}
	
	// ports open
	let server_ports = ns.getServerNumPortsRequired(server);
	// calculate nb of ports the player can open
	let player_port = 0;
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
	return player_port >= server_ports;
}


//* ------------------------------- Compromise ----------------------------------
function Compromise(ns: NS, target: string): string {
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


// TODO
//^ --------------------------------- Get RAM -----------------------------------
// returns the RAM of all the admin servers in the form:{server1: RAM, server2: RAM, ... }
export function Get_RAM(ns: NS, admin_servers: string[]): AllRAM {
	let all_RAM: AllRAM = {};
	// iterate servers in accessible_servers
	for (let server of admin_servers){
		let server_RAM = ns.getServerMaxRam(server);
		if (server_RAM > 0){
			all_RAM[server] = server_RAM;
		}
	}
	return all_RAM;
}

