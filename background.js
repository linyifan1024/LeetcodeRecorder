/*
 * trade off:
 * we store all problems in memory
 * maybe we should fetch them from the server every time
 *
 * we will see how it goes
 */

import {DIFFICULTY, EVENTS, REVERSE_DIFFICULTY} from "./const.ts";
import { onMessage } from 'webext-bridge'

class LeetCoder {
  constructor() {
    this.loaded = false;
    this.allProblems = [];
    this.problems = [];
    this.stats = [];
    this.lastUpdated = new Date();
    this.init();
  }
  /**
   * Fetches all problems from LeetCode
   * and choose 4 problems to solve
   */
  async init() {
    const response = await fetch('https://leetcode.com/api/problems/algorithms/');
    const data = await response.json();
    this.data = data;
    this.allProblems = data.stat_status_pairs;
    this.loaded = true;
    this.getStats()
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
  async getStats() {
    if(!this.loaded)
      await this.init();
    const { ac_easy, ac_medium, ac_hard } = this.data
    this.stats = [ac_easy, ac_medium, ac_hard]
  }
}

const leetcoder = new LeetCoder();

const formatProblems = problems => problems.map((problem) => ({
  title: problem.stat.question__title,
  id: problem.stat.frontend_question_id,
  difficulty: REVERSE_DIFFICULTY[problem.difficulty.level],
  link: problem.stat.question__title_slug
}))

onMessage(EVENTS.GET_DATA, async () => {
  // if not loaded, wait for it to load
  if (!leetcoder.loaded)
    await leetcoder.init();

  return {
    data: leetcoder.data,
    problems: formatProblems(leetcoder.problems),
    stats: leetcoder.stats,
  };
});

onMessage(EVENTS.REFRESH_PROBLEM, async () => {
  await leetcoder.refreshProblems();
  return {
    problems: formatProblems(leetcoder.problems),
  };
})
