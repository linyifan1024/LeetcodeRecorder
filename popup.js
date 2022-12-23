import {EVENTS, REVERSE_DIFFICULTY} from './const.js';
import { sendMessage } from 'webext-bridge'


// function updateProblems() {
//   fetch('https://leetcode.com/api/problems/all/').then((response) => {
//     return response.json();
//   }).then((data) => {
//     problemlist.innerHTML = '';
//
//     const problems = data.stat_status_pairs;
//
//     const easyProblems = problems.filter((problem) => problem.difficulty.level === 1);
//     const mediumProblems = problems.filter((problem) => problem.difficulty.level === 2);
//     const hardProblems = problems.filter((problem) => problem.difficulty.level === 3);
//     // Iterate over the list of problems
//     const shuffledEasy = easyProblems.sort(() => Math.random() - 0.5);
//     const shuffledMedium = mediumProblems.sort(() => Math.random() - 0.5);
//     const shuffledHard = hardProblems.sort(() => Math.random() - 0.5);
//     selectedProblems = [shuffledEasy[0], shuffledMedium[0], shuffledMedium[1], shuffledHard[0]];
//
//     for (const problem of selectedProblems) {
//       // Create a list item for the problem
//
//       const item = document.createElement('li');
//       const link = document.createElement('a');
//       link.style.color = 'inherit';
//       if (problem.difficulty.level === 1) {
//         item.classList.add('list-group-item-action');
//         item.style.color = 'green';
//       }
//       if (problem.difficulty.level === 2) {
//
//         item.classList.add('list-group-item-action');
//         item.style.color = 'orange';
//       }
//       if (problem.difficulty.level === 3) {
//
//         item.classList.add('list-group-item-action');
//         item.style.color = 'red';
//       }
//       item.classList.add('list-group-item');
//       link.textContent = ` ${problem.stat.question_id} - ${problem.stat.question__title_slug}  `;
//       link.href = `https://leetcode.com/problems/${problem.stat.question__title_slug}/`;
//       // Create a checkbox for the problem
//       const checkbox = document.createElement('input');
//       checkbox.type = 'checkbox';
//       checkbox.value = problem.stat.question__title_slug;
//
//       // Append the link and checkbox to the list item
//       item.appendChild(checkbox);
//       // Append the link to the list item
//       item.appendChild(link);
//       problemlist.appendChild(item);
//       problemlist.style.textAlign = 'left';
//     }
//
//   });
// }


// function fetchData() {
//   fetch('https://leetcode.com/api/problems/algorithms/')
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       const items = [
//         { text: `Total: ${data.num_solved}` },
//         { text: `Easy: ${data.ac_easy}`, class: 'list-group-item-success' },
//         { text: `Medium: ${data.ac_medium}`, class: 'list-group-item-warning' },
//         { text: `Hard: ${data.ac_hard}`, class: 'list-group-item-danger' }
//       ];
//
//       datalist.innerHTML = '';
//       for (const item of items) {
//         const li = document.createElement('li');
//         li.textContent = item.text;
//         li.classList.add("list-group-item");
//         if (item.class) {
//           li.classList.add(item.class);
//
//
//         }
//         datalist.appendChild(li);
//       }
//       datalist.style.textAlign = 'left';
//
//     });
// }



/**
 *
 * @param {problems: {}} data
 */
const renderProblems = (data) => {
  const problems = data.problems.map((problem) => ({
    title: problem.stat.question__title,
    id: problem.stat.frontend_question_id,
    difficulty: REVERSE_DIFFICULTY[problem.difficulty.level],
  }))
  console.warn(problems)
  // your code here @linyifan
}





document.addEventListener('DOMContentLoaded', async () => {
  const data = await sendMessage(EVENTS.GET_PROBLEM, {}, 'background');
  renderProblems(data);
})
