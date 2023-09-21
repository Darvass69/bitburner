import { NS } from "@ns";
import config from "./config";
import { ServerList, RAMInfo } from "@/portTypes";
// find all available RAM and send it to a port


export async function main(ns: NS): Promise<void> {
	ns.disableLog("ALL")
	//ns.tail()

  const {root} = JSON.parse(ns.peek(config.ports.serverList) as string) as ServerList;
	let RAMInfo: RAMInfo = {}
	// iterate servers and get their RAM and type
	for (let server of root){
		let serverRAM = ns.getServerMaxRam(server);
		if (serverRAM > 0) {
			// keep 10 GB free in  home
			if (server == "home"){
				RAMInfo[server] = {RAM: serverRAM - 16, type: checkType(ns, server)}
			}
			else {
				RAMInfo[server] = {RAM: serverRAM, type: checkType(ns, server)}
			}
		}
	}

	ns.writePort(config.ports.RAMInfo, JSON.stringify(RAMInfo))
}


//! add bought servers (use regex?) to player
function checkType(ns: NS, server: string): "player" | "hacked" {
	if (server == "home") return "player"
	return "hacked"
}