/**
 * write: /money/loop/findServers.js
 * 
 * clear access: /money/loop/manager.js
 * 
 * read only: /money/loop/findRAM.js, /money/loop/findTarget.js
 * 
 * content: list of every server
 */
 export type ServerList = {
	root: string[]
	noRoot: string[]
};


/**
 * write: /money/loop/findTarget.js
 * 
 * clear access: /money/loop/manager.js
 * 
 * read only: 
 * 
 * content: target and target information
 * 
 * send an empty target to stop all script that read it.
 */
 export type TargetInfo = [string, number, number]


/**
 * write: /money/loop/findRAM.js
 * 
 * clear access: /money/loop/manager.js
 * 
 * read only: 
 * 
 * content: what server has usable RAM and how much. Also has the type for ns.share
 */
export type RAMInfo = {[server:string]: {RAM: number, type: "player" | "hacked"}}

// reserve ports here
type Port1 = ServerList
type Port2 = TargetInfo
type Port3 = RAMInfo