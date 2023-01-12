/** @param {NS} ns */

// find and add all server to a txt file
export async function main(ns) {
	const all_server_list = [];
	// start with home
	var server_list = ns.scan("home");

	// find all neighbors and their neighbors and..., add them to a list
	while (server_list.length > 0) {
		all_server_list.push(server_list[0]);

		// scan servers around
		var new_server = ns.scan(server_list[0]);

		// remove previous server from the list
		new_server.shift();
		server_list.shift();

		// add new server to the list
		server_list = server_list.concat(new_server);
	
	}

	ns.write("all-servers.txt", JSON.stringify(all_server_list), "w");
}