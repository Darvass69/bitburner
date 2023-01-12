/** @param {NS} ns */

// basic map & script that allow to connect to desired server

	// EXTRA INFO
    var show_contract = false;
    var contract_color = "\x1b[38;5;63]m";
    var show_server_level = true;
    // level_color = [< player,>= player]
    var level_color = ["38;5;52","38;5;22"];
    var show_memory = true;
    var memory_color = "32";
    
        // LINE
    var indent = "   ";
    var line_color = "32"; // white = 38;5;7  default terminal green: 32
    
        // SERVER COLOR
    // if no other color, this is default for servers
    var default_color = "38;5;245";	// gray = 38;5;245
    // root color = [can root, has root]
    var root_color = ["38;5;124", "32"]; // red = 38;5;124	normal = 32
    // backdoor (for factions)
    // backdoor_color = [no root, no BD, can BD, has BD]
    var backdoor_color = ["38;5;55", "38;5;4", "38;5;6", "38;5;14"];
    var backdoor_servers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave"];
    
    // ?? color based on nb ports required
    
    
    
    var _ns;
    export async function main(ns) {
        // _ns so we dont need to pass it to functions
        _ns = ns;
    
        var start_server = "home"; // ns.args[0]
        var is_start = true;
        var prefix = `\x1b[${line_color}m`;
        var is_last = true;
    
        // starting the scan process
        Server_scan(start_server, prefix, is_last, is_start);
    }
    
    function Server_scan(current_server, prefix, is_last, is_start){
        // find child servers, the first one is always the parent, exception: home has no parent
        if (current_server == "home"){
            var new_servers = _ns.scan(current_server);
        }
        else {
            var new_servers = _ns.scan(current_server);
            new_servers.shift();
        }
    
        // print current server
        Print_server(current_server, prefix + (!is_start ? (is_last ? "└─ ": "├─ ") : ""));
    
        // sort new_servers by number of childrens
        new_servers = new_servers.sort(Child_compare);
    
        // scan next servers
        let i = 0;
        var new_servers_length = new_servers.length;
        //_ns.tprint("new servers " + JSON.stringify(new_servers) + "length " + new_servers_length);
        for (var new_server of new_servers){
            i++;
            var new_is_last = (i == new_servers_length) ? true: false;
            //_ns.tprint("server: ", new_server, " i: ", i);
            if (is_last){
                Server_scan(new_server, prefix + " " + indent, new_is_last, false);
            }
            else{
                Server_scan(new_server, prefix + "|" + indent, new_is_last, false);
            }
        }
    }
    
    function Child_compare(a, b){
        return Child_count(a) > Child_count(b) ? 1 : -1;
    }
    
    function Child_count(server){
        var count = 0;
        var server_list = _ns.scan(server)
        for (var i = 1; i < server_list.length; i++){
            count += Child_count(server_list[i]) + 1;
        }
        return count;
    }
    
    // prints a server
    function Print_server(server, prefix){
        var to_print = prefix + "\x1b[" + Server_color(server) + "m" + server + Server_extra_stats(server);
        _ns.tprint(to_print);
    }
    
    
    // default_color
    // root color = [can root, has root]
    // backdoor_color = [no root, root but !BD, can BD, has BD]
    // backdoor_servers = []
    /*
    has root
        faction
            has BD
            can BD
            !BD
        has root
    can root
        !faction
            can root
    no root
        faction
            no root
        default
    */
    function Server_color(server){
        if (_ns.hasRootAccess(server)){
            if (backdoor_servers.includes(server)){
                if ((_ns.getServer(server)).backdoorInstalled){
                    var color = backdoor_color[3];
                }
                else if (_ns.getHackingLevel() > _ns.getServerRequiredHackingLevel(server)){
                    var color = backdoor_color[2];
                }
                else {
                    var color = backdoor_color[1];
                }
            }
            else {
                var color = root_color[1];
            }
        }
        else if (Is_weak(server)){
            var color = root_color[0]
        }
        else {
            if (backdoor_servers.includes(server)){
                var color = backdoor_color[0];
            }
            else {
                var color = default_color;
            }
        }
        return color;
    }
    
    function Is_weak(server) {
        // 2 var for NUKE
        // 1) hacking level
        var hacking_level = _ns.getHackingLevel();
        var server_level = _ns.getServerRequiredHackingLevel(server);
        // 2) ports open
        var server_ports = _ns.getServerNumPortsRequired(server);
        // calculate nb of ports the player can open
        var player_port = 0;
        if (_ns.fileExists("BruteSSH.exe")) {
            player_port++;
        }
        if (_ns.fileExists("FTPCrack.exe")) {
            player_port++;
        }
        if (_ns.fileExists("relaySMTP.exe")) {
            player_port++;
        }
        if (_ns.fileExists("HTTPWorm.exe")) {
            player_port++;
        }
        if (_ns.fileExists("SQLInject.exe")) {
            player_port++;
        }
    
        // logic
        if (server == "home" || server == "darkweb"){
            return false;
        }
        else if (/*hacking_level >= server_level && */ player_port >= server_ports) {
            return true;
        }
        return false;
    }
    
    
    // extra stats if needed
    // show coding contract: find contracts and mark them with C in \x1b[38;5;160] 
    // show server hack level
    // show memory
    function Server_extra_stats(server){
        var output = " ";
        if (show_contract){
            // coding contract
            _ns.ls(server, ".cct").forEach(contract_name => {
                output += contract_color + JSON.stringify(contract_name) + " " +
                    //Comment out the next line to reduce footprint by 5 GB
                    _ns.codingcontract.getContractType(contract_name, server) + " "; 
            });
        }
        if (show_server_level){
            var player_level = _ns.getHackingLevel()
            var server_level = _ns.getServerRequiredHackingLevel(server)
            if (player_level >= server_level){
                output += `\x1b[${level_color[1]}m` + "(" + JSON.stringify(server_level) + ") "
            }
            else {
                output += `\x1b[${level_color[0]}m`+ "(" + JSON.stringify(server_level) + ") "
            }
        }
        if (show_memory){
            var max_ram = _ns.getServerMaxRam(server)
            if (max_ram > 0){
                output += `\x1b[${memory_color}m${max_ram} GB `;
            }
        }
        return output;
    }