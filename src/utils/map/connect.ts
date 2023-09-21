import { NS } from "@ns";
import config from "@/money/loop/config";
import { TargetInfo } from "@/portTypes";



/**
 * ! explain args and check args types
 * @param 
 */
let _ns: NS;
export async function main(ns: NS): Promise<void> {
	_ns = ns;
	var server = ns.args[0] as string;
	if (server == "target") {
		let [target] = JSON.parse(ns.peek(config.ports.targetInfo) as string) as TargetInfo
		server = target
	}
	var path = Get_server_path(server);
	var output = "home; "
	path.forEach((server) => output += "connect " + server + "; ");

	// add command to terminal
	const doc = eval("document");
		const terminalInput = doc.getElementById("terminal-input");
		terminalInput.value = output;
		const handler = Object.keys(terminalInput)[1];
		terminalInput[handler].onChange({ target: terminalInput });
}

function Get_server_path(server: string): string[]{
	// stop at home
	if (server == "home") {return []}
	// scan for servers and keep the parent
	let parent = _ns.scan(server)[0]
	let path = Get_server_path(parent)
	path.push(server)
	return path;
}