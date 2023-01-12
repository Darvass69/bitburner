/** @param {NS} ns */

export async function main(ns) {
	// find all servers
	let pid = ns.run("find-servers.js");
	while (ns.isRunning(pid)) { await ns.sleep(100); }

	// find and compromise all possible servers 
	// and write them and already compromised server to root.txt
	pid = ns.run("find-and-compromise.js")
	while (ns.isRunning(pid)) { await ns.sleep(100); }

	// find the best target in root.txt for money
	/*
	pid = ns.run("find-doge-target.js")
	while (ns.isRunning(pid)) { await ns.sleep(100); }
	*/

	// run doge on all roots
	pid = ns.run("run-on-root.js");
	while (ns.isRunning(pid)) { await ns.sleep(100); }
}