/** @param {NS} ns */

// this is my own implementation of formulas.exe, usefull mostly to understand the impact of changing a variable

/* security
hack + 0.002
grow + 0.004
weaken - 0.05 * (1 + (cores - 1) / 16)

	time
grow time = 3.2 * hacking time
weaken time = 4 * hacking time
*/


	
export function Hack_time(server, player) {
	// player
	const hacking_skill = player.skills.hacking;
	const player_hacking_speed_mult = player.mults.hacking_speed;
	const intelligence = player.skills.intelligence;

  		// server
  	const required_hacking_skill = server.requiredHackingSkill;
  	const server_security = server.hackDifficulty;
		
  	let hack_time = (5 * ((2.5 * (required_hacking_skill * server_security) + 500) / (hacking_skill + 50))) / (player_hacking_speed_mult * (1 + Math.pow(intelligence, 0.8)))
  	return hack_time;
	}

export function Hack_chance(server, player) {
  	// player
  	const hacking_skill = player.skills.hacking;
  	const player_hacking_chance_mult = player.mults.hacking_chance;
  	const intelligence = player.skills.intelligence;

  	// server
  	const required_hacking_skill = server.requiredHackingSkill;
  	const server_security = server.hackDifficulty;

  	let hack_chance_equation = (1.75 * hacking_skill - required_hacking_skill) / (1.75 * hacking_skill) *
    	(100 - server_security) / 100 * player_hacking_chance_mult * (1 + intelligence ** 0.8);
  	// limit hack_chance_equation between 0 & 1
  	let hack_chance = Math.max(Math.min(hack_chance_equation, 1), 0);
  	return hack_chance;
}

export function Hack_exp(server, player) {
  	// player
  	let player_hacking_exp_mult = player.mults.hacking_exp;

  	// server
  	let base_security = server.baseDifficulty; if (base_security == null) { base_security = server_security }

  	// bitnode
  	// var bitnode_hacking_exp_mult = bitnode.HackExpGain;

  	let hack_exp = (3 + base_security * 0.3) * player_hacking_exp_mult /* bitnode_hacking_exp_mult*/;
  	return hack_exp;
}

export function Hack_percent(server, player) {
  	// player
  	const hacking_skill = player.skills.hacking;
  	const player_hacking_money_mult = player.mults.hacking_money;

  	// server
  	const server_security = server.hackDifficulty;
  	const required_hacking_skill = server.requiredHackingSkill;

  	// bitnode
  	// const bitnode_hack_money_mult = bitnode.ScriptHackMoney;

  	let hack_percent = ((100 - server_security) / 100) * ((hacking_skill - (required_hacking_skill - 1)) / hacking_skill) * player_hacking_money_mult /* bitnode_hack_money_mult*/ / 240;
  	// limit hack_percent_equation between 0 & 1
  	hack_percent = Math.max(Math.min(hack_percent, 1), 0);

  	return hack_percent;
}

export function Growth_percent(server, player, threads) {
  	// limits threads to ints >= 0
  	threads = Math.max(Math.floor(threads), 0);

  	// player
  	const player_grow_mult = player.mults.hacking_grow;

  	// server
  	const server_security = server.hackDifficulty;
  	const cores = server.cpuCores;
  	const server_growth = server.serverGrowth;

  	// 
  	const growth_rate = Math.min(1 + (1.03 - 1) / server_security, 1.0035)
  	const cores_bonus = (1 + (cores - 1) / 16);

  	let growth_percent = Math.pow(growth_rate, threads * (server_growth / 100) /* BitNodeMultipliers.ServerGrowthRate*/ * player_grow_mult * cores_bonus);
  	return growth_percent;
}