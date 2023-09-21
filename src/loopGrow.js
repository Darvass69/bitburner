/** 
 * @param {import("../NetscriptDefinitions").NS} ns	
 */
export async function main(ns) {
	while (true) {
		let portValue = ns.peek(ns.args[0])
		if (portValue === "NULL PORT DATA"){ns.exit()}
		let data = JSON.parse(portValue);
		if (data[0] === "") {ns.exit()}
		await ns.grow(data[0])
	}
}