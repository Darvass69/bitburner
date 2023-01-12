/** @param {NS} ns */

// compromise a weak servers and add them to root.txt
export async function main(ns) {
	const target = ns.args[0];
	ns.tprint(target);

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

	// add target to root.txt
	const root = JSON.parse(ns.read("root.txt"));
	root.push(target);
	ns.write("root.txt", JSON.stringify(root), "w");
}