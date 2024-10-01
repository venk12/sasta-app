import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons';

const AIMessage = ({ content }) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const checkedList = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([rowId, content]) => ({ rowId, content }));
    console.log('All checked items:', checkedList);
  }, [checkedItems]);

  const handleCheckboxChange = (rowId, rowContent) => {
    setCheckedItems(prev => ({
      ...prev,
      [rowId]: prev[rowId] ? undefined : rowContent
    }));
  };

  const renderContent = () => {
    if (typeof content === 'string') {
      const parts = content.split('\n');
      let isTable = false;
      let tableRows = [];

      return parts.map((part, index) => {
        if (part.startsWith('| ')) {
          // This is likely a table row
          isTable = true;
          const cells = part.split('|').filter(cell => cell.trim() !== '');
          tableRows.push(cells);

          if (index === parts.length - 1 || !parts[index + 1].startsWith('| ')) {
            // End of table, render it
            const table = (
              <table key={`table-${index}`} className="border-collapse border w-full mb-4">
                <tbody>
                  {tableRows.map((row, rowIndex) => {
                    const rowId = `${index}-${rowIndex}`;
                    const rowContent = row.join(' | ');
                    return (
                      <tr key={rowIndex}>
                        <td className="border px-4 py-2">
                          <input
                            type="checkbox"
                            checked={!!checkedItems[rowId]}
                            onChange={() => handleCheckboxChange(rowId, rowContent)}
                          />
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border px-4 py-2">{cell.trim()}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            isTable = false;
            tableRows = [];
            return table;
          }
          return null;
        } else if (isTable) {
          // Skip table separator rows
          return null;
        } else if (part.startsWith('**')) {
          // This is likely a header
          return <h3 key={index} className="font-bold mt-4 mb-2">{part.replace(/\*/g, '')}</h3>;
        } else {
          // Regular text
          return <p key={index} className="mb-2">{part}</p>;
        }
      }).filter(Boolean);
    }
    return <p>{content}</p>;
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2 mt-1">
          <FontAwesomeIcon icon={faChalkboardUser} className="text-gray-500" />
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AIMessage;