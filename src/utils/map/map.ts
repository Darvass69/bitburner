import { NS } from "@ns";
import config from "@/utils/map/config";
import pServConfig from "@/utils/player_servers/config";

// basic map & script that allow to connect to desired server

//* all of this can go in config file

		// EXTRA INFO
let showContractName = false;
let showContractType = false;
let showContractIcon = true;
let contractColor = "\x1b[38;5;63]m";
let showServerLevel = true;
// levelColor = [level < player, level >= player]
let levelColor = ["38;5;52","38;5;22"];
let showMemory = true;
let memoryColor = "32";

		// LINE
let indent = "   ";
let lineColor = "32"; // white = 38;5;7	default terminal green: 32

		// SERVER COLOR
// if no other color, this is default for servers
let defaultColor = "38;5;245";	// gray = 38;5;245
// root color = [can root, has root]
let rootColor = ["38;5;124", "32"]; // red = 38;5;124	normal = 32
// backdoor (for factions)
// backdoorColor = [no root, no BD, can BD, has BD]
let backdoorColor = ["38;5;55", "38;5;4", "38;5;6", "38;5;14"];
let backdoorServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave",];

// ?? color based on nb ports required

let defaultStartServer = "home"



/**
 * ! explain args and check args types
 * @param 
 */
var _ns: NS;
export async function main(ns: NS): Promise<void> {
	// _ns so we don't need to pass it to functions
	_ns = ns;

	let startingServer = /*ns.args[0] ??*/ defaultStartServer;
	var prefix = `\x1b[${lineColor}m`;
	// 
	var isStart = true;
	var isLast = true;

	// starting the scan process
	Server_scan(startingServer, prefix, isLast, isStart);
}


/**
 * ! explain how it works
 * @param current_server 
 * @param prefix 
 * @param is_last 
 * @param is_start 
 */
function Server_scan(current_server: any, prefix: any, is_last: any, is_start: any){
	// find child servers, the first one is always the parent, exception: home has no parent
	if (current_server == "home"){
		var new_servers = _ns.scan(current_server);
	}
	else {
		var new_servers = _ns.scan(current_server);
		new_servers.shift();
	}

	// print current server
	Print_server(current_server, prefix + (!is_start ? (is_last ? "└─ ": "├─ ") : ""));

	// sort new_servers by number of children and put player servers at the top
	new_servers = new_servers.sort((a, b) => {
		let aIsPlayer = a.startsWith(pServConfig.defaultPlayerServerName);
		let bIsPlayer = b.startsWith(pServConfig.defaultPlayerServerName);
		if (aIsPlayer && bIsPlayer) {
			return parseInt(a.substring(pServConfig.defaultPlayerServerName.length)) - parseInt(b.substring(pServConfig.defaultPlayerServerName.length))
		}
		else if (aIsPlayer) return -1
		else if (bIsPlayer) return 1
		return Child_count(a) - Child_count(b)
	});

	// scan next servers
	let i = 0;
	var new_servers_length = new_servers.length;
	//_ns.tprint("new servers " + JSON.stringify(new_servers) + "length " + new_servers_length);
	for (var new_server of new_servers){
		i++;
		var new_is_last = (i == new_servers_length) ? true: false;
		//_ns.tprint("server: ", new_server, " i: ", i);
		if (is_last){
			Server_scan(new_server, prefix + " " + indent, new_is_last, false);
		}
		else{
			Server_scan(new_server, prefix + "|" + indent, new_is_last, false);
		}
	}
}

/**
 * ! explain how it works
 * @param server 
 * @returns 
 */
function Child_count(server: any){
	var count = 0;
	var server_list = _ns.scan(server)
	for (var i = 1; i < server_list.length; i++){
		 count += Child_count(server_list[i]) + 1;
	}
	return count;
}


// prints a server
/**
 * ! explain how it works
 * @param server 
 * @param prefix 
 */
function Print_server(server: any, prefix: any){
	var to_print = prefix + "\x1b[" + Server_color(server) + "m" + server + Server_extra_stats(server);
	_ns.tprintf(to_print);
}


// default_color
// root color = [can root, has root]
// backdoor_color = [no root, root but !BD, can BD, has BD]
// backdoor_servers = []
/*
has root
	faction
		has BD
		can BD
		!BD
	has root
can root
	!faction
		can root
no root
	faction
		no root
	default
*/
/**
 * ! explain how it works
 * @param server 
 * @returns 
 */
function Server_color(server: any){
	if (_ns.hasRootAccess(server)){
	 	if (backdoorServers.includes(server)){
			if ((_ns.getServer(server)).backdoorInstalled){
				var color = backdoorColor[3];
			}
			else if (_ns.getHackingLevel() > _ns.getServerRequiredHackingLevel(server)){
				var color = backdoorColor[2];
			}
			else {
				var color = backdoorColor[1];
			}
		}
		else {
			var color = rootColor[1];
		}
	}
	else if (Is_weak(server)){
		var color = rootColor[0]
	}
	else {
		if (backdoorServers.includes(server)){
			var color = backdoorColor[0];
		}
		else {
			var color = defaultColor;
		}
	}
	return color;
}

/**
 * Return if a server can get nuked.
 * @param host Hostname of target server.
 * @returns if the server can get nuked.
 */
function Is_weak(host: string) {
	// 1 var for NUKE: only need ports
	_ns.getServer().backdoorInstalled
	let serverPorts = _ns.getServerNumPortsRequired(host);
	// calculate nb of ports the player can open
	let playerPorts = 0;
	if (_ns.fileExists("BruteSSH.exe")) playerPorts++;
	if (_ns.fileExists("FTPCrack.exe")) playerPorts++;
	if (_ns.fileExists("relaySMTP.exe")) playerPorts++;
	if (_ns.fileExists("HTTPWorm.exe")) playerPorts++;
	if (_ns.fileExists("SQLInject.exe")) playerPorts++;
	return playerPorts >= serverPorts
}


// extra stats if needed
// show coding contract: find contracts and mark them with C in \x1b[38;5;160] 
// show server hack level
// show memory
function Server_extra_stats(server: any){
	var output = " ";
	if (showContractName || showContractType){
		// coding contract
		_ns.ls(server, ".cct").forEach((contractName) => {
			output += contractColor;
			output += showContractName ? contractName + ", " : "" ;
			output += showContractType ? _ns.codingcontract.getContractType(contractName, server) + ", " : "";
		});
	}
	else if (showContractIcon){
		_ns.ls(server, ".cct").forEach(() => {output += `${contractColor}©`});
	}
	if (showServerLevel){
		var player_level = _ns.getHackingLevel()
		var server_level = _ns.getServerRequiredHackingLevel(server)
		if (player_level >= server_level){
			output += `\x1b[${levelColor[1]}m` + "(" + JSON.stringify(server_level) + ") "
		}
		else {
			output += `\x1b[${levelColor[0]}m`+ "(" + JSON.stringify(server_level) + ") "
		}
	}
	if (showMemory){
		var max_ram = _ns.getServerMaxRam(server)
		if (max_ram > 0){
			output += `\x1b[${memoryColor}m${max_ram} GB `;
		}
	}
	return output;
}