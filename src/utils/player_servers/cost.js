/** 
 * @param {import("../../../NetscriptDefinitions").NS} ns  
 */
export async function main(ns) {
	var owned = ns.getPurchasedServers();
	var limit = ns.getPurchasedServerLimit();
	ns.tprint(owned.length + "/" + limit + " server bought");

	// print owned server
	for (var server in owned){
		ns.tprint(server +  " " + /*ns.getServerMaxRam(server) +*/ "GB")
	}

	var ram = 0;
	var max_ram = ns.getPurchasedServerMaxRam();
	let space = " ";
	// print each cost for each amount of RAM
	for (var i = 1 ; ram <= max_ram; i++){
		ram = 2 ** i;
		// to have everything line up, make sure first half length = 15
		let first_half = "RAM: " + ram + "GB ";
		first_half = first_half.padEnd(15, " ");
		ns.tprint(first_half + "cost: " +  To_currency(ns.getPurchasedServerCost(ram)));
	}
	
	
	// add command to terminal
	const doc = eval("document");
	const terminalInput = doc.getElementById("terminal-input");
	terminalInput.value = "run server/buy.js " + "pserv-" + owned.length;
	const handler = Object.keys(terminalInput)[1];
	terminalInput[handler].onChange({ target: terminalInput });

}

// change a number to its multiple of 1000. k, m, b, t
function To_currency (number){
	var multiple = 1000 ** 4;
	if (number > multiple){
		return JSON.stringify(number/multiple) + "t"
	}
	multiple /= 1000;
	if (number > multiple){
		return JSON.stringify(number/multiple) + "b"
	}
	multiple /= 1000;
	if (number > multiple){
		return JSON.stringify(number/multiple) + "m"
	}
	multiple /= 1000;
	if (number > multiple){
		return JSON.stringify(number/multiple) + "k"
	}
	return JSON.stringify(number)
}