/** @param {NS} ns */

var _ns;
export async function main(ns) {
	_ns = ns;
	var server = ns.args[0];
	var path = Get_server_path(server);
	var output = "home; "
	path.forEach(server => output += "connect " + server + "; ");

	// add command to terminal
	const doc = eval("document");
    const terminalInput = doc.getElementById("terminal-input");
    terminalInput.value = output;
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
}

function Get_server_path(server){
	// stop at home
	if (server == "home") {return []}
	// scan for servers and keep the parent
	var parent = _ns.scan(server)[0]
	var path = Get_server_path(parent)
	path.push(server)
	return path;
}