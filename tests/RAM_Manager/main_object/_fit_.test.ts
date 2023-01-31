import { describe, expect, test} from '@jest/globals';
import { RAM_Manager, AvailableRAM, Timing } from '../../../src/RAM_manager/RAM_manager';
import { AllRAM } from '../../../src/RAM_manager/Find_All_RAM';
import { RAMRequest } from '../../../src/RAM_manager/Requester_types';
import { RAMState } from '../../../src/RAM_manager/RAM_types';

describe('_general_', () => {
  let table_for_Fit_any: Array<[AllRAM, RAMState, RAMRequest, string | number]> = [
    //^ test 0: 1 server, a simple request that can be completely fulfilled
    [
      //* all_RAM
      {
        // servers
        "home": 32,
      },
      //* state of RAM
      {
        // times
        0: {
          // servers
          "home":{
            // PIDs
            1:{
              // type
              Script: 2,
              Process: 2,
            },
          },
        },
      },
      //* request, can be script or process
      {
        Script:{
          ScriptName: ["hack.js", "home"],
          RAM:{
            Threads: 1,
            ThreadSize: 2,
            Server: ["home", "joesguns"]
          },
          Timing: [0, 100],
          args: [],
        }
      },
      //* expected
      0,
    ],

    //^ test 1: 
    [
      //* all_RAM
      {
        // servers
        "home": 32,
        "joesguns": 32,
      },
      //* state of RAM
      {
        // times
        0: {
          // servers
          "home":{
            // PIDs
            1:{
              // type
              Script: 2,
              Process: 2,
            },
          },
        },
      },
      //* request, can be script or process
      {
        Script:{
          ScriptName: ["hack.js", "home"],
          RAM:{
            Threads: 1,
            ThreadSize: 2,
            Server: ["home", "joesguns"]
          },
          Timing: [0, 100],
          args: [],
        }
      },
      //* expected
      0,
    ]
  ]

  describe('Fit_any', () => {
    test.each(table_for_Fit_any)('Fit_any test %#', (all_RAM, state_of_RAM, input_request, expected) => {
      let manager = RAM_Manager
      manager.all_RAM = all_RAM
      manager.state_of_RAM = state_of_RAM
      manager.server_list = Object.keys(manager.all_RAM)

      expect(manager._fit_._general_.Fit_any(input_request)).toStrictEqual(expected)
    })
  })
  


  let table_for_Average_remaining_RAM: Array<[number[], string[], AvailableRAM, Timing, AllRAM]> = [
    // 0
    [
      // sorted_timestamps
      [100,110,120,130],
      // server_list, 
      ["home","n00dles","foodnstuff","sigma-cosmetics","joesguns"],
      // available_RAM
      {
        100:{
          "home":0,"n00dles":30,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":0,
        },
        110:{
          "home":0,"n00dles":0,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":20,
        },
        120:{
          "home":20,"n00dles":0,"foodnstuff":0,"sigma-cosmetics":30,"joesguns":0,
        },
        130:{
          "home":20,"n00dles":0,"foodnstuff":30,"sigma-cosmetics":0,"joesguns":0,
        },
      },
      // timing
      [100, 140],
      // expected
      {"home":10,"n00dles":7.5,"foodnstuff":7.5,"sigma-cosmetics":7.5,"joesguns":5}
    ],
    // 1: if both start & end are in the same timestamp
    [
      // sorted_timestamps
      [100,130],
      // server_list, 
      ["home","n00dles","foodnstuff","sigma-cosmetics","joesguns"],
      // available_RAM
      {
        100:{
          "home":10,"n00dles":30,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":5,
        },
        130:{
          "home":20,"n00dles":0,"foodnstuff":30,"sigma-cosmetics":0,"joesguns":5,
        },
      },
      // timing
      [110, 120],
      // expected
      {"home":10,"n00dles":30,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":5}
    ],


    // 2: if there is only 1 timestamp
    [
      // sorted_timestamps
      [0],
      // server_list, 
      ["home","n00dles","foodnstuff","sigma-cosmetics","joesguns"],
      // available_RAM
      {
        0:{
          "home":0,"n00dles":30,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":5,
        },
      },
      // timing
      [100, 140],
      // expected
      {"home":0,"n00dles":30,"foodnstuff":0,"sigma-cosmetics":0,"joesguns":5}
    ]
  ]

  describe('Average_remaining_RAM', () => {
    test.each(table_for_Average_remaining_RAM)('Average_remaining_RAM %#', 
    (sorted_timestamps, server_list, available_RAM, timing, expected) => {
      let manager = RAM_Manager
      RAM_Manager._time_.sorted_timestamps = sorted_timestamps
      expect(manager._fit_._general_.Average_remaining_RAM(server_list, available_RAM, timing)).toStrictEqual(expected)
    })
  })
})
