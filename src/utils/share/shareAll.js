/** 
 * @param {import("../../../NetscriptDefinitions").NS} ns  
 */
export async function main(ns) {
	let script = "utils/share/share-controller.js";
	let servers = ns.getPurchasedServers()
	for (let server of servers) {
		ns.exec(script, "home", 1, 100,server)
		await ns.sleep(100)
	}
	ns.exec(script, "home", 1, 100, "home")
}