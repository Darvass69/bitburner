import { describe, expect, test} from '@jest/globals';
import { RAM_Manager } from '../../../src/RAM_manager/RAM_manager';


let table_for_Timestamps_in_interval: Array<["instant" | "infinite" | [StartTime: number, EndTime?: number], number[], number[]]> = [
  // timing       sorted_timestamps                  expected
  // current time is 100
  // simple test, start & end are within timestamps domain
  // no conflicts between start, timestamps and end
  // timestamps has normal amount of elements
  [[1000, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 6000, 800, 1200, 5000]],

  //* start time test
  // same as first test, but we have start be == to an element in timestamps
  [[1200, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [1200, 6000, 1200, 5000]],
  // now start is close, but slightly lower
  [[1199, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [1199, 6000, 800, 1200, 5000]],
  // now start is close, but slightly higher
  [[1201, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [1201, 6000, 1200, 5000]],
  //~ now use some weird input
  [[-1000, 6000],     [0, 500, 800, 1200, 5000, 7000, 8000], [100, 6000, 0, 500, 800, 1200, 5000]],
  [[1000.2654, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [1000.2654, 6000, 800, 1200, 5000]],
  [[NaN, 6000],       [0, 500, 800, 1200, 5000, 7000, 8000], [NaN, 6000]],
  [[Infinity, 6000],  [0, 500, 800, 1200, 5000, 7000, 8000], [Infinity, 6000]],
  [[-Infinity, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [100, 6000, 0, 500, 800, 1200, 5000]],

  //* end time test
  // same as first test, but we have end be == to an element in timestamps
  [[1000, 7000], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 7000, 800, 1200, 5000]],
  // now end is close, but slightly lower
  [[1000, 6999], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 6999, 800, 1200, 5000]],
  // now end is close, but slightly higher
  [[1000, 7001], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 7001, 800, 1200, 5000, 7000]],
  //~ now use some weird input
  [[1000, -6000],     [0, 500, 800, 1200, 5000, 7000, 8000], [1000, -6000,]],
  [[1000, 6000.2654], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 6000.2654, 800, 1200, 5000]],
  [[1000, NaN],       [0, 500, 800, 1200, 5000, 7000, 8000], [1000, NaN]],
  [[1000, Infinity],  [0, 500, 800, 1200, 5000, 7000, 8000], [1000, Infinity, 800, 1200, 5000, 7000, 8000]],
  [[1000, -Infinity], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, -Infinity]],

  // start & end are the same
  [[1000, 1000], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 1000]],
  // start & end are in the same timestamp
  [[1000, 1100], [0, 500, 800, 1200, 5000, 7000, 8000], [1000, 1100, 800]],

  // undefined end time
  [[1000],  [0, 500, 800, 1200, 5000, 7000, 8000], [1000, Infinity, 800, 1200, 5000, 7000, 8000]],

  //* sorted timestamps test
  // start is before first timestamp --> never happens because timestamp always has 0 and start >= 0
  [[200, 6000], [0, 500, 800, 1200, 5000, 7000, 8000], [200, 6000, 0, 500, 800, 1200, 5000]],
  // timestamps are empty --> never empty, at least [0]
  [[200, 6000], [0], [200, 6000, 0]],

  //* other timings
  ["infinite", [0, 500, 800, 1200, 5000, 7000, 8000], [100, Infinity, 0, 500, 800, 1200, 5000, 7000, 8000]],
  ["instant", [0, 500, 800, 1200, 5000, 7000, 8000], [132, 164, 0]],


]

describe('Timestamps_in_interval', () =>{
  test.each(table_for_Timestamps_in_interval)('Timestamp test %#', (timing, sorted_timestamps, expected) => {
    let manager = RAM_Manager
    manager._time_.sorted_timestamps = sorted_timestamps
    expect(manager._time_.Timestamps_in_interval(timing, false, true, 100)).toStrictEqual(expected)
  })
})
