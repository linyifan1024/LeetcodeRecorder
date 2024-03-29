import React, {useEffect, useState} from "react";
import { sendMessage } from "webext-bridge";
import { EVENTS, REVERSE_DIFFICULTY } from '../../const.js'
import './style.css';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState({});
  const [problems, setProblems] = useState([])
  useEffect(async () => {
    const data = await sendMessage(EVENTS.GET_DATA, {}, 'background');
    setData(data);
    setProblems(data.problems);
    setIsLoading(false);
  }, [])

  if(isLoading) {
    return <div
      className="w-[300px] h-[100px] flex justify-center items-center text-lg"
    >loading...</div>
  }

  return <div className="w-[300px] p-[12px] space-y-[12px]">

    {/* 1. current progress */}
    <div>
      <div className="text-lg section-title"> Current Progress </div>

      <div className="flex space-x-[5px]">
        {data.stats.map((count, idx) => (
          <span style={{color: 
            REVERSE_DIFFICULTY[idx+1] === 'Easy' ? 'green' :
            REVERSE_DIFFICULTY[idx+1] === 'Medium' ? 'orange' :
            'red'
          }}>{`${REVERSE_DIFFICULTY[idx+1]}: ${count}`}</span>
        ))}
      </div>
    </div>
          
    {/* 2. daily challenge */}
    <div>
      <div className="text-lg section-title"> Daily Challenge </div>
      <div>
        {
          problems.map((problem) => (
            <div className="truncate overflow-ellipsis">
              <a href={`https://leetcode.com/problems/${problem.link}/`} target="_blank" style={{color: 
            problem.difficulty === 'Easy' ? 'green' :
            problem.difficulty === 'Medium' ? 'orange' :
            'red'
          }}>
                {problem.id} - {problem.difficulty} - {problem.title}
              </a>
            </div>
          ))
        }
      </div>
    </div>

    <button onClick={
      async () => {
        const data = await sendMessage(EVENTS.REFRESH_PROBLEM, {}, 'background')
        setProblems(data.problems)
      }} type="button">
        Refresh
    </button>
  </div>
}


export default App
