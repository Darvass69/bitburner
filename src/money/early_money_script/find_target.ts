import { NS } from "@ns";
import config from "./config";

type server_txt = {
		root: string[]
		noRoot: string[]
};

// find the best target for money and write it to target.txt
// find the server with the more max money that has hacking level < 1/3 of current (rule of thumb of getting started)
export async function main(ns: NS): Promise<void> {
	const {root, noRoot} = JSON.parse(ns.read(config.files.servers_txt)) as server_txt;
	const servers = root.concat(noRoot)
	const playerHackLevel = ns.getHackingLevel()

	// filter by <= hacklvl /2 and give a rank (rank = max money/min security )
	let serverRanks = [] as {server: string, rank: number}[]
	for (const server of servers) {
		if (server != null && ns.getServerRequiredHackingLevel(server) <= playerHackLevel / 2) {
			serverRanks.push({server: server, rank: ns.getServerMaxMoney(server) / ns.getServerMinSecurityLevel(server)})
		}
	}
	// sort by rank in descending order
	serverRanks.sort((a, b) => b.rank - a.rank)
	
	const target = serverRanks[0]?.server ?? "n00dles";
	const moneyThresh = ns.getServerMaxMoney(target) * 0.9; // 0.95 or 0.75
	const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

	// target.txt = [target, moneyThresh, securityThresh]
	//ns.tprint([target, moneyThresh, securityThresh])
	ns.write(config.files.target_txt, JSON.stringify([target, moneyThresh, securityThresh]), "w");
}