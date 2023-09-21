import { NS } from "@ns";
import config from "@/utils/player_servers/config";

// buy and upgrade servers automatically. Favors buying first, then upgrading
export async function main(ns: NS): Promise<void> {
	ns.tail()

	let serverLimit = ns.getPurchasedServerLimit()
	let purchasedServers = ns.getPurchasedServers()
	//& see if they are named correctly. If not, fix them.
	let nbCurrentServer = purchasedServers.length
	
	/** Amount of RAM for the server. when every server is at a certain amount, we increase it */
	let RAM = {
		exp: 3,
		value: () => 2 ** RAM.exp,
		nbServer: 0,

		/** call when upgrading a server to track how many we have with the current amount of RAM */
		updateNbServer: () => {
			RAM.nbServer++
			if (RAM.nbServer >= serverLimit){
				RAM.exp++;
				RAM.nbServer = 0;
			}
		}
	}

	
	while (true) {
		if (nbCurrentServer < serverLimit){
			// buy a bunch 4GB servers to be upgraded later
			let funds = ns.getServerMoneyAvailable("home");
			let cost = ns.getPurchasedServerCost(4)
			if (funds * config.maxFundFraction > cost){
				ns.purchaseServer(config.defaultPlayerServerName + nbCurrentServer, 4);
				nbCurrentServer++;
			}
			else {
				// when we don't have enough to buy, we wait for some time before trying again
				await ns.sleep(1000 * 60 * config.waitTime)
			}
		}
		else {
			/** whether or not we upgraded a sever */
			let hasUpgraded = false

			// try to upgrade every server. If we don't find one, wait and try again later
			for (let currentServer = 0; currentServer < serverLimit; currentServer++){
				let funds = ns.getServerMoneyAvailable("home");
				let cost = ns.getPurchasedServerUpgradeCost(config.defaultPlayerServerName + currentServer,RAM.value());
				ns.print(`ram: ${RAM.value()}`)
				if (funds * config.maxFundFraction > cost){
					ns.upgradePurchasedServer(config.defaultPlayerServerName + currentServer, RAM.value());
					RAM.updateNbServer();
					hasUpgraded = true;
				}
				else {
					ns.print(`cost (${cost} $) is to big`)
				}
				await ns.sleep(10)
			}
			if (!hasUpgraded) {
				// when we don't have enough to upgrade, we wait for some time before trying again
				await ns.sleep(1000 * 60 * config.waitTime)
			}

			if (RAM.exp > 20) {break;}
		}
	}
}
