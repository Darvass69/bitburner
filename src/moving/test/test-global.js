/** @param {NS} ns */
let globalVariable1;


export async function main(ns) {
	var instance = ns.args;
	globalVariable1 = ns.args;
	while(true) {
		ns.tprint("instance: ", instance, " global1: ", globalVariable1);
		await ns.sleep(3000);
	}

}