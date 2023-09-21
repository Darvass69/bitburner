import { NS } from "@ns";
// run this script to manually start everything

// get settings (change to absolute import?)
import config from "./config";

// change target when run
let autoTarget = true;
// time between restarting the script, in milliseconds
let restartDelay = 1000 * 60 * 10 * 0// = 10 mins

export async function main(ns: NS): Promise<void> {
	do {
		ns.tprint("starting");
		// find and compromise all possible servers and write them to servers.txt
		//! print status
		ns.tprint("finding servers")
		let pid = ns.run(config.files.find_servers)
		while (ns.isRunning(pid)) { await ns.sleep(100); }
		await ns.sleep(1000 * 5)

		// find the best target in root list for money
		//! print status
		if (autoTarget){
			ns.tprint("targeting")
			pid = ns.run(config.files.find_target)
			while (ns.isRunning(pid)) { await ns.sleep(100); }
		}
		await ns.sleep(1000 * 5)

		// run money_printer.js on all possible machines
		//! print status
		ns.tprint("running")
		await ns.sleep(100)
		pid = ns.run(config.files.run_on_servers);
		while (ns.isRunning(pid)) { await ns.sleep(100); }

		if (restartDelay) {
			await ns.sleep(restartDelay);
		}
		else break
	}
	while (restartDelay)
}