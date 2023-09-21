/** @param {NS} ns */
// removes every .js and .txt files
export async function main(ns) {
	// start with home
	let server_list = ["home"];

	let log = "Removed:\n"

	// go through every server and remove all .js and .txt files
	while (server_list.length > 0) {
		let js = ns.ls(server_list[0], ".js");
		let txt = ns.ls(server_list[0], ".txt");

		log += `${server_list[0]}: `
		for (let file of js) {
			log += file + ", "
			if (file != "super_file_remover_9000.js") {
				ns.rm(file, server_list[0])
			}
		}
		for (let file of txt) {
			log += file + ", "
			ns.rm(file, server_list[0])
		}
		log += "\n"

		// scan servers around
		let new_server = ns.scan(server_list[0]);

		// remove previous server from the lists
		new_server.shift();
		server_list.shift();

		// add new server to the list
		server_list = server_list.concat(new_server);
	
	}

	ns.write("log.txt", log, "w");
}