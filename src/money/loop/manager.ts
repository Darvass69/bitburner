import { NS } from "@ns";
import config from "./config";
import { RAMInfo, TargetInfo } from "@/portTypes";
// deploy loop_hack.js, loop_grow.js, loop_weaken.js (looping scripts) in a certain ratio
// how do we know the ratio? start with 1/10/2

type ThreadRatios = {[server: string]: number}

// script size = 1.6 + 0.15 (grow, weaken) or 1.6 + 0.10 (hack)
// 				max = 1.75
let maxSize = 1.75

export async function main(ns: NS): Promise<void> {
	ns.disableLog("ALL")
	ns.tail()

	/**
	 * call another script that find and compromise all possible servers and write them to config.ports.serverList
	 */
	async function findServers() {
		ns.clearPort(config.ports.serverList)
		//! print status
		ns.print("finding servers")
		let pid = ns.run(config.files.findServers)
		while (ns.isRunning(pid)) {await ns.sleep(100)}
	}

	/**
	 * call another script that find available RAM and write them to config.ports.RAMInfo
	 * Will also call findServers that change config.ports.serverList
	 */
	async function findRam() {
		await findServers()
		ns.clearPort(config.ports.RAMInfo)
		// find available RAM
		//! print status
		ns.print("finding RAM")
		let pid = ns.run(config.files.findRAM)
		while (ns.isRunning(pid)) {await ns.sleep(100)}
	}

	/**
	 * call another script that find the best target in root list for money and write it to config.ports.targetInfo
	 * Will also call findServers that change config.ports.serverList
	 */
	async function findTarget() {
		await findServers()
		ns.clearPort(config.ports.targetInfo)
		//! print status
		ns.print("finding target")
		let pid = ns.run(config.files.findTarget)
		while (ns.isRunning(pid)) {await ns.sleep(100)}
	}


	let data = {
		updateRatio: () => {},
		// default: 1 10 2
		ratio: {
			hack: 10,
			grow: 1000,
			weaken: 100,
			Total: () => data.ratio.hack + data.ratio.grow + data.ratio.weaken
		},

		/**
		 * call another script that find the best target in root list for money and write it to config.ports.targetInfo
		 * Will also call findServers that change config.ports.serverList
		 */
		updateTarget: async () => {
			await findTarget();
			//[data.targetInfo.target, data.targetInfo.maxMoney, data.targetInfo.minSecurity] = JSON.parse(ns.peek(config.ports.targetInfo) as string) as TargetInfo;
		},
		/* targetInfo: {
			target: "",
			maxMoney: 0,
			minSecurity: 0
		},*/
		
		/**
		 * call another script that find available RAM and write them to config.ports.RAMInfo
		 * Will also call findServers that change config.ports.serverList
		 */
		updateRAM: async () => {
			await findRam();
			data.RAMInfo = JSON.parse(ns.peek(config.ports.RAMInfo) as string) as RAMInfo
		},
		RAMInfo: {} as RAMInfo
	}


	ns.print("starting loop");

	await data.updateTarget()
	await data.updateRAM()


	// get all available thread, ignore servers with < 13 threads
	//! change 13 threads to be ratio.Total (need to change threadInfo each times ratio is recalculated)
	//! store nb of ratios that fit in each machines, change this later to be more efficient with RAM
	let threadRatios: ThreadRatios = {}
	for (let server in data.RAMInfo){
		//! for now, we won't separate scripts. Every hack, weaken, grow for a single ratio instance will be on the same server
		// nbRatios = nbThreads / totalRatioThreads
		let nbRatios = Math.floor((ns.getServerMaxRam(server) / maxSize) / data.ratio.Total())
		if (nbRatios > 0) threadRatios[server] = nbRatios
	}
	
	ns.print("thread ratios", threadRatios)

	// run scripts in the appropriate ratio
	//! add functionality to change ratio dynamically and close script in excess but not all of them
	//! also look ahead to select a value for sleep that separate uniformly the scripts

	for (let server in threadRatios){
		// kill all scripts
		if (server == "home"){
			ns.killall(server);
		}
		else {
			ns.killall(server);
			// replace file on the server
			ns.scp(config.files.hack, server);
			ns.scp(config.files.grow, server);
			ns.scp(config.files.weaken, server);
		}


		for (let i = 0; threadRatios[server] > i; i++){
			ns.print(`batch ${i}, ${server}, h:${data.ratio.hack} g:${data.ratio.grow} w:${data.ratio.weaken}`);
			if (data.ratio.hack > 0) {
				let hackSuccess = ns.exec(config.files.hack, server, data.ratio.hack, config.ports.targetInfo)
				if (!hackSuccess) ns.print(`ERROR: hack launch failed on ${server}`)
			}
			if (data.ratio.grow > 0) {
				let growSuccess = ns.exec(config.files.grow, server, data.ratio.grow, config.ports.targetInfo)
				if (!growSuccess) ns.print(`ERROR: grow launch failed on ${server}`)
			}
			if (data.ratio.weaken > 0) {
				let weakenSuccess = ns.exec(config.files.weaken, server, data.ratio.weaken, config.ports.targetInfo)
				if (!weakenSuccess) ns.print(`ERROR: weaken launch failed on ${server}`)
			}

			await ns.sleep(config.launchDelay)
		}

		ns.print("done")

		await ns.sleep(config.launchDelay)
	}

}



// run ratio. if there is still some RAM, repeat (ignore servers with < 13 threads possible)
// change ratios based on analyze functions
// change ratios based on formulas










/*
Loop algorithms
Difficulty: Easy to Medium

Pros:
	Simple to understand
	Works at any stage of the game
	Maximize RAM usage

Cons:
	Requires a script that handles deployment
	By splitting our hack, weaken, and grow functions into three separate scripts, we can both remove our reliance on functions 
	such as getServerSecurityLevel() as well as removing functions that cannot work concurrently, reducing RAM requirements, and thus 
	increasing our thread limits. Loop scripts are formatted like this:

loop forever {
	await ns.hack(target) // or grow, or weaken
}

Now we can take the total amount of threads available and split it and allocate, for example:

1 part to the hack scripts
10 parts to the grow scripts
2 parts to the weaken scripts

Meaning if we have space for 100 threads across the entire network 7 threads will go to the hack scripts, 
76 threads will go to the grow scripts and 15 threads will go to the weaken scripts. 

The ratios described here are arbitrary and can be greatly improved through the use of the analyze functions, 
and later, through the use of Formulas.exe.

When utilizing this strategy, monitor the amount of money and security on the target server, if the money is 
not hovering around maximum and the security around the minimum, the ratios should be tweaked until that is the case.

Utilizing sleep() or asleep() to ensure that your scripts do not all start at the same time can decrease the chance of 
issues associated with overhacking occurring. Both functions have a ram cost of zero.






*/

