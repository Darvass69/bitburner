import { NS } from "@ns";
import config from "./config";
// run money_printer on every possible machines. we keep ~10 GB free on home to run other scripts
import type { ServerList } from "./find_servers";


export async function main(ns: NS): Promise<void> {
	const servers: ServerList = JSON.parse(ns.read(config.files.servers_txt));

	// target.txt = [target, moneyThresh, securityThresh]
	const [target, moneyThresh, securityThresh] = JSON.parse(ns.read(config.files.target_txt)) as [string, number, number];
	ns.tprint([target, moneyThresh, securityThresh]);

	for (const server of servers.root) {
		// kill all scripts
		if (server == "home"){
			ns.kill(config.files.money_printer, server)
		}
		else {
			ns.killall(server);
			// replace file on the server
			ns.scp(config.files.money_printer, server);
		}


		// start as many times as possible, by batch of 50 threads max
		let threadCount = countThread(ns, config.files.money_printer, server);
		let maxThread = 50
		let i = 1;
		while (threadCount > 0){
			let threadRun = 0;
			if (threadCount > maxThread){
				threadRun = maxThread;
				threadCount -= maxThread;
			}
			else {
				threadRun = threadCount;
				threadCount = 0;
			}
			
			ns.tprint(`batch ${i}, ${server}, ${threadRun}`);
			ns.exec(config.files.money_printer, server, threadRun, target, moneyThresh, securityThresh, i);
			i ++;
			await ns.sleep(1000 * 2)
		}
	}
}

// count the number of thread for a file on a server
function countThread(ns: NS, script: string, server: string) {
	if (server == "home"){
		return Math.floor((ns.getServerMaxRam(server) - 10) / ns.getScriptRam(script));
	}
	return Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(script));
}