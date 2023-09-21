import { NS } from "@ns";
import config from "./config";
import pServConfig from "./../../utils/player_servers/config";
// get every server and gain root access when possible. add the result to all_servers.txt

export type ServerList = {
	root: string[],
	noRoot: string[],
};

export async function main(ns: NS): Promise<void> {
	ns.disableLog("ALL")
	//ns.tail()

	const serverList: ServerList = {
		root: [],
		noRoot: [],
	};
	// start with home
	let remainingServers = ["home"];

	// find all neighbors and their neighbors and...
	// gain root access if possible
	// add them to the list
	// ignore root for servers without RAM
	let all: string[] = []
	while (remainingServers.length > 0) {
		// get current server and remove it from the list
		let current = remainingServers[0];
		all.push(current)
		remainingServers.shift();
		
		// try to gain root access
		gainRoot(ns, current, serverList)

		// find next servers, the first one is always the parent, exception: home has no parent
		if (current == "home"){
			var newServers = ns.scan(current);
		}
		else {
			var newServers = ns.scan(current);
			newServers.shift();
		}
		
		// add new server to the list
		remainingServers = remainingServers.concat(newServers);
	}

	ns.write(config.files.servers_txt, JSON.stringify(serverList), "w");
}


// gain root access if possible
function gainRoot(ns: NS, server: string, serverList: ServerList){
	if (isWeak(ns, server)) {
		if (ns.hasRootAccess(server)) {
			if (ns.getServerMaxRam(server) == 0){
				//! print no RAM
				ns.tprint(`no RAM: ${server}`)
				serverList.noRoot.push(server)
			}
			else {
				//! print server
				ns.tprint(`root: ${server}`)
				serverList.root.push(server)
			}
		}
		else {
			getRootAccess(ns, server)
			if (ns.getServerMaxRam(server) == 0){
				//! print no RAM
				ns.tprint(`no RAM: ${server}`)
				serverList.noRoot.push(server)
			}
			else if (ns.hasRootAccess(server)) {
				//! print compromised server
				ns.tprint(`gained root: ${server}`)
				serverList.root.push(server)
			}
			else {
				//! print error
				ns.tprint(`ERROR: failed to gained root access on ${server}`)
				serverList.noRoot.push(server)
			}
		}
	}
	else {
		//! print no root
		ns.tprint(`no root: ${server}`)
		serverList.noRoot.push(server)
	}
}



function isWeak(ns: NS, server: string) {
	if (server == "home" || server.startsWith(pServConfig.defaultPlayerServerName)){
		return true
	}
	// 1 var for NUKE: only need ports
	let serverPorts = ns.getServerNumPortsRequired(server);

	// calculate nb of ports the player can open
	let playerPorts = 0;
	if (ns.fileExists("BruteSSH.exe")) playerPorts++;
	if (ns.fileExists("FTPCrack.exe")) playerPorts++;
	if (ns.fileExists("relaySMTP.exe")) playerPorts++;
	if (ns.fileExists("HTTPWorm.exe")) playerPorts++;
	if (ns.fileExists("SQLInject.exe")) playerPorts++;

	return playerPorts >= serverPorts
}


function getRootAccess(ns: NS, target: string) {
	// open ports
	if (ns.fileExists("BruteSSH.exe")) ns.brutessh(target)
	if (ns.fileExists("FTPCrack.exe")) ns.ftpcrack(target)
	if (ns.fileExists("relaySMTP.exe")) ns.relaysmtp(target)
	if (ns.fileExists("HTTPWorm.exe")) ns.httpworm(target)
	if (ns.fileExists("SQLInject.exe")) ns.sqlinject(target)

	// nuke
	ns.nuke(target);
}