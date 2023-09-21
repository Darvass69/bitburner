import { NS } from "@ns";
import config from "./config";
import { ServerList } from "@/portTypes";


// find the best target for money and write it to a port
// find the server with highest rank (max money/min security) and <= hacklvl /2
export async function main(ns: NS): Promise<void> {
	ns.disableLog("ALL")
	//ns.tail()

	const {root} = JSON.parse(ns.peek(config.ports.serverList) as string) as ServerList;
	const servers = root;
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
	//ns.tprint(serverRanks)

	
	const target = /*"rho-construction" ??*/ serverRanks[0].server ?? "n00dles";

	// target.txt = [target, moneyThresh, securityThresh]
	ns.writePort(config.ports.targetInfo, JSON.stringify([target, ns.getServerMaxMoney(target), ns.getServerMinSecurityLevel(target)]));
}