/** @param {NS} ns */

// started as a target selecter/manager/???
// ended up as a mess of trying to understand how everything worked.
// not really usefull


/*  1: create a method to make money
    2: evaluate the method on different server to find the best target(s)
*/

var verify_equations = false;



export async function main(ns) {
  // player
  var player = ns.getPlayer();

  // server
  var server = ns.getServer(ns.args[0]);

  // bitnode
  // var bitnode = ns.getBitNodeMultipliers();

  /*  calculations  */
  // hack speed
  var hack_time_formulas = ns.formulas.hacking.hackTime(server, player);
  var hack_time_equation = Hack_time(server, player);

  // hack chance
  var hack_chance_formulas = ns.formulas.hacking.hackChance(server, player);
  var hack_chance_equation = Hack_chance(server, player);

  // exp gain
  var exp_formulas = ns.formulas.hacking.hackExp(server, player);
  var exp_equation = Hack_exp(server, player);

  // % hack
  var hack_percent_formulas = ns.formulas.hacking.hackPercent(server, player)
  var hack_percent_equation = Hack_percent(server, player);

  /* growth */
  // initial var
  var threads = 1;
  var cores = server.cpuCores;

  var growth_percent_formulas = ns.formulas.hacking.growPercent(server, threads, player, cores);
  var growth_percent_equation = Growth_percent(server, player, threads);


  if (verify_equations) {
    ns.tprint("hack speed: ", hack_time_formulas, " ", hack_time_equation * 1000, " ", hack_time_formulas == hack_time_equation * 1000);

    ns.tprint("hack chance: ", hack_chance_formulas, " ", hack_chance_equation, " ", hack_chance_formulas == hack_chance_equation);

    ns.tprint("exp: ", exp_formulas, " ", exp_equation, " ", exp_formulas == exp_equation);

    ns.tprint("hack %: ", hack_percent_formulas, " ", hack_percent_equation, " ", hack_percent_formulas == hack_percent_equation);

    ns.tprint("grow %: ", growth_percent_formulas, " ", growth_percent_equation, " ", growth_percent_formulas == growth_percent_equation);
  }

  // timing test using exec
  let port = 1;
  ns.clearPort(port);
  ns.scp("port.js", "n00dles")

  let time1 = performance.now();
  ns.exec("port.js", "n00dles", 1, time1);
  await ns.sleep(1000);
  let time2 = ns.readPort(port);
  ns.tprint(time2 - time1);

  /* security
  hack + 0.002
  grow + 0.004
  weaken - 0.05 * (1 + (cores - 1) / 16)







// batching is complicated
// some stuff as a baseline, not important
5 * ((2.5 * (required_hacking_skill * server_security) + 500) / (hacking_skill + 50)) = 50
2.5 * (required_hacking_skill * server_security) = 10 * (hacking_skill + 50) - 500
required_hacking_skill * server_security = 4 * (hacking_skill + 50) - 200
x * 10 = 4 * (150 + 50) - 200
x = (4 * (150 + 50) - 200) / 10 = 80 - 20 = 60

hack %:
((100 - 10) / 100) * ((150 - (60 - 1)) / 150) / 240 = 0.2275%

****************************
required_hacking_skill = 60
server_security = 10
hacking_skill = 150

we have a prepared server. $100m, security 10, req skill 60
hack skill = 150

hack time = 50 sec
grow time = 3.2 * hacking time = 160 sec
weaken time = 4 * hacking time = 200 sec

hack % = 0.2275%
hack money = 227 500 $


for threads for 
hack: same %/thread, but security (0.002) * threads
grow: use grow formula, security (0.004) * threads
weaken: security (0.05) * threads


so, we want to run as many hack() as possible, we want the security to be as low as possible and to maintain it,
thus keep security at minimum (but don't waste weaken), it also increase the amount hacked
keep the cash at max.

security matters for:
hack start (faster time), hack finish (more money)
grow start (faster time), grow finish (more effective)
weaken: we need min security

HWGW
H 1
W 3.2
G 4
W 3.2
H                |----|
W1    |----|----|----|-
G |----|----|----|----|
W2    |----|----|----|-
  |----|----|----|----|
  0    1    2    3    4


target time = end time of the hack

start G at current time = (target time + G delay) - time for G
then start W1 at current time = (target time + W1 delay) - time for W
then start W2 at current time = (target time + W2 delay) - time for W
then start H at current time = target time - time for H

G delay + W1 delay + W2 delay = 





*/

}




function Hack_time(server, player) {
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


function Hack_chance(server, player) {
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


function Hack_exp(server, player) {
  // player
  let player_hacking_exp_mult = player.mults.hacking_exp;

  // server
  let base_security = server.baseDifficulty; if (base_security == null) { base_security = server_security }

  // bitnode
  // var bitnode_hacking_exp_mult = bitnode.HackExpGain;

  let hack_exp = (3 + base_security * 0.3) * player_hacking_exp_mult /* bitnode_hacking_exp_mult*/;
  return hack_exp;
}


function Hack_percent(server, player) {
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

function Growth_percent(server, player, threads) {
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



/*
from src/Hacking.ts
########################
hacking time (in s, * 1000 for ms) =
    [5 * (2.5 * required hacking skill * server security + 500) / (hacking level + 50)] /
    (player hacking speed mult * (1 + intelligence ^ 0.8))

grow time = 3.2 * hacking time
weaken time = 4 * hacking time
########################
hacking chance =
    (1.75 * hacking skill - required hacking skill) / (1.75 * hacking skill) *
    (100 - server security) / 100 *
    player hacking chance mult *
    (1 + intelligence ^ 0.8)

  if (chance > 1) {
    return 1;
  }
  if (chance < 0) {
    return 0;
  }

########################
expGain =
    3 +
    base security *
    0.3 *
    player hacking exp mult *
    bitnode hacking exp mult

########################
percent money =
    ((100 - server security) / 100 *
  (hacking level - required hacking skill - 1) / hacking level *
  player hacking money mult *
  bitnode hacking money mult) / 240;

  if (percentMoneyHacked < 0) {
    return 0;
  }
  if (percentMoneyHacked > 1) {
    return 1;
  }


########################
// security
hack + 0.002
grow + 0.004
weaken - 0.05 * (1 + (cores - 1) / 16)
########################
from: src/Server/formulas/grow.ts

    // const numServerGrowthCycles = Math.max(Math.floor(threads), 0);
(int) threads >= 0;


  growth rate = 1 + (1.03 - 1) / server security; // (1 + (1.03 - 1) / server security) <= 1.0035

server growth = adjGrowthRate ^ (threads * server.serverGrowth / 100 * Bitnode growth mult * player.mults.hacking_grow * (1 + (cores - 1) / 16)))
*/