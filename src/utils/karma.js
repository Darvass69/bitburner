/** 
 * @param {import("../../NetscriptDefinitions").NS} ns  
 */

let delay = 250;
export async function main(ns) {
	ns.disableLog('ALL');
	ns.tail();
	ns.atExit(() => {ns.closeTail(ns.pid)})
	
	ns.moveTail(60, 0)
	ns.resizeTail(200, 50)

	let targetTime = Date.now() + delay;

	while (true) {
		ns.getRunningScript().tailProperties ?? ns.exit();
		ns.clearLog();
		ns.print('Current Karma : ', ns.heart.break());

		await ns.sleep(delay);
	}
}