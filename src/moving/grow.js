/** @param {NS} ns */
export async function main(ns) {
	let server = ns.args[0];
	await ns.grow(server);
}