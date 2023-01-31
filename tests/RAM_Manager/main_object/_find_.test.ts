import { describe, expect, test} from '@jest/globals';
import { RAM_Manager, AvailableRAM } from '../../../src/RAM_manager/RAM_manager';
import { AllRAM } from '../../../src/RAM_manager/Find_All_RAM';
import { RAMState } from '../../../src/RAM_manager/RAM_types';
import { PID } from '../../../src/RAM_manager/Requester_Types';

/* All RAM
{"home": ,"n00dles":4,"foodnstuff":16,"sigma-cosmetics":16,"joesguns":16,"hong-fang-tea":16,"harakiri-sushi":16,"iron-gym":32,"myServer":64,"myServer-0":4096,"myServer-1":4096,"myServer-2":4096,"nectar-net":16,"CSEC":8,"zer0":32,"max-hardware":32,"neo-net":32,"silver-helix":64,"omega-net":32,"phantasy":32,"avmnite-02h":64,"the-hub":32,"netlink":16,"summit-uni":16,"zb-institute":128,"rothman-uni":16,"catalyst":16,"I.I.I.I":32,"millenium-fitness":32,"rho-construction":64,"alpha-ent":128,"aevum-police":64,"lexo-corp":64,"global-pharm":32,"unitalife":64,"omnia":16,"solaris":128,"univ-energy":32,"microdyne":64,"run4theh111z":512,"titan-labs":128,"helios":64,"vitalife":32,"fulcrumtech":2048,"omnitek":128,".":16,"blade":512,"powerhouse-fitness":32}
*/

/* to test Available_RAM, we need to have a variety of values of inputs "all_RAM" & "state_of_RAM"
all_RAM
  always has number > 0, always real servers, always at least home (so never empty)
RAMState
  always has existing times (no infinity, no NaN, no negatives)
  always has existing servers (they are also all included in all_RAM)
  always has existing PID (no infinity, no NaN, no negatives)
  the values of the 3 optional properties are always numbers

What can't fail
  the time keys --> they are directly taken from RAMState

What can fail
  servers are taken from all_RAM, might not be in state_of_RAM
  what happens when all the RAM is used for the same timestamp?
    empty timestamp

*/


let all_RAM: AllRAM = {"home":32,"n00dles":4,"foodnstuff":16,"sigma-cosmetics":16,"joesguns":16,"hong-fang-tea":16,"harakiri-sushi":16,"iron-gym":32}
let state_of_RAM: RAMState = {
  0:{
    "home":{
      1:{"Script": 10,}
    },
    "n00dles":{
      1:{"Process": 4,}
    },
    "foodnstuff":{
      1:{"Reserved": [4, 0],}
    }
  },
  100:{
    "home":{
      1:{"Script": 10,}
    },
    "n00dles":{
      1:{"Process": 4,}
    },
    "foodnstuff":{
      1:{"Reserved": [4, 0],}
    }
  },
  1000:{
    "home":{1:{"Process": 32}},
    "n00dles":{1:{"Process": 4}},
    "foodnstuff":{1:{"Process": 16}},
    "sigma-cosmetics":{1:{"Process": 16}},
    "joesguns":{1:{"Process": 16}},
    "hong-fang-tea":{1:{"Process": 16}},
    "harakiri-sushi":{1:{"Process": 16}},
    "iron-gym":{1:{"Process": 32}},
  }
}

let table_for_Available_RAM: Array<[AllRAM, RAMState, AvailableRAM]> = [
    [all_RAM, state_of_RAM, 
      {
        0:{
          "home":22,"foodnstuff":16,"sigma-cosmetics":16,"joesguns":16,"hong-fang-tea":16,"harakiri-sushi":16,"iron-gym":32
        },
        100:{
          "home":22,"foodnstuff":16,"sigma-cosmetics":16,"joesguns":16,"hong-fang-tea":16,"harakiri-sushi":16,"iron-gym":32
        },
        1000:{},
      }
    ],
]




describe('Available_RAM', () =>{
  test.each(table_for_Available_RAM)('Available RAM %#', (all_RAM , state_of_RAM, expected) => {
    let manager = RAM_Manager
    manager.all_RAM = all_RAM
    manager.state_of_RAM = state_of_RAM

    expect(manager._find_.Available_RAM()).toStrictEqual(expected)
  })
})