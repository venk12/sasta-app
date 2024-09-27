import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const HelperFormation = ({potential_answers}) => {
  return (
    <div className="flex justify-start mb-4">
    <div className="flex items-center">
      <div className="flex-shrink-0 mr-2">
        <FontAwesomeIcon icon={faComments} className="text-gray-500" />
      </div>
      <div
        className="flex items-left w-full bg-green-200 dark:text-white dark:bg-gray-700 text-left p-3 rounded-lg shadow"
      >
        <div>
        <span className="text-sm text-green-600 font-bold font-italics">Response Assist</span>
          <br/>
        <span className="text-sm text-green-600">Hover over the words for meaning</span>
          <div className="flex flex-wrap space-x-2 space-y-2">
          {potential_answers && potential_answers.map((item, index) => {
            const [question, answer] = Object.entries(item)[0];
            return (
              <span
                key={index}
                className="relative group cursor-pointer text-sm bg-green-600 px-2 py-1 rounded my-1"
              >
                {question}
                <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-no-wrap z-10">
                  {answer}
                </span>
              </span>
            );
          })}
          </div>
          </div>
      </div>
    </div>
  </div>
  )
}

export default HelperFormation