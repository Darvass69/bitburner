/** @param {NS} ns */

// find the best target in root.txt for money and write it to target-doge.txt  
// only criteria is max money for now, need to be upgraded at some point
export async function main(ns) {
	const roots = JSON.parse(ns.read("root.txt"));
	// find the server with the more max money in root that has hacking level < 1/3 of current (rule of thumb of gettig started)
	var max_money = 0;
	for (const server of roots) {
		var server_max_money = ns.getServerMaxMoney(server)
		if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() / 3) {
			if (max_money < server_max_money) {
				max_money = server_max_money;
				var target_server = server;
			}
		}
	}
	if (!target_server){
		target_server = "n00dles";
	}

	// target-doge.txt = [target, moneyThresh, securityThresh]
	const target_stats = [];
	target_stats[0] = target_server;
	target_stats[1] = ns.getServerMaxMoney(target_stats[0]) * 0.5; // 0.95 or 0.75
	target_stats[2] = ns.getServerMinSecurityLevel(target_stats[0]) + 5;
	ns.write("target-doge.txt", JSON.stringify(target_stats), "w");
}