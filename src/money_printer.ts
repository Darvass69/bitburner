import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
	var target = ns.args[0] as string;
	var moneyThresh = ns.args[1] as number;
	var securityThresh = ns.args[2] as number;

	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) await ns.weaken(target);
		else if (ns.getServerMoneyAvailable(target) < moneyThresh) await ns.grow(target);
		else await ns.hack(target);
	}
}