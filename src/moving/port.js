/** @param {NS} ns */
// used with money.js for testing latency of ports
// results are: ports are very quick

export async function main(ns) {
	let time2 = performance.now();
	ns.writePort(1, time2);
}