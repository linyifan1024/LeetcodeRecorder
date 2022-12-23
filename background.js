/*
 * trade off:
 * we store all problems in memory
 * maybe we should fetch them from the server every time
 *
 * we will see how it goes
 */

import {DIFFICULTY, EVENTS} from "./const.js";
import { onMessage } from 'webext-bridge'

class LeetCoder {
  constructor() {
    this.loaded = false;
    this.allProblems = [];
    this.problems = [];
    this.init();
    this.lastUpdated = new Date();
  }
  /**
   * Fetches all problems from LeetCode
   * and choose 4 problems to solve
   */
  async init() {
    const response = await fetch('https://leetcode.com/api/problems/algorithms/');
    const data = await response.json();
    this.allProblems = data.stat_status_pairs;
    this.loaded = true;
    this.refreshProblems();
  }
  /**
   * Selects 1 easy, 2 medium, 1 hard problem
   */
  refreshProblems() {
    // select 1 easy, 2 medium, 1 hard
    // 2 medium cannot be the same
    const [easy, medium, hard] = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD].map(level => this.allProblems.filter(problem => problem.difficulty.level === level));
    this.problems = [
      easy[Math.floor(Math.random() * easy.length)],
      // avoid duplicate medium problems
      medium.splice(Math.floor(Math.random() * medium.length), 1)[0],
      medium[Math.floor(Math.random() * medium.length)],
      hard[Math.floor(Math.random() * hard.length)],
    ];
  }
}

const leetcoder = new LeetCoder();


chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === EVENTS.GET_PROBLEM) {
      // if we have already loaded the problems, send them back
      if (leetcoder.loaded)
        return port.postMessage({ problems: leetcoder.problems });
      // otherwise, wait for the problems to load
      leetcoder.init().then(() => {
        port.postMessage({ problems: leetcoder.problems });
      });
    }

    else if (msg.type === EVENTS.REFRESH_PROBLEM) {
      leetcoder.getProblems();
      port.postMessage({ problems: leetcoder.problems });
    }
  });
})

onMessage(EVENTS.GET_PROBLEM, async () => {
  // if not loaded, wait for it to load
  if (!leetcoder.loaded)
    await leetcoder.init();

  return { problems: leetcoder.problems };
});

onMessage(EVENTS.REFRESH_PROBLEM, async () => {
  await leetcoder.refreshProblems();
  return { problems: leetcoder.problems };
})
