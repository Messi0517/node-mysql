import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

function CalendarView({ tasks }) {
  // 日付ごとのタスクを取得
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = tasks.filter(
        task => task.due_date === date.toISOString().slice(0, 10)
      );
      return (
        <ul className="calendar-task-list">
          {dayTasks.map(task => (
            <li key={task.id} className="calendar-task-item">{task.content}</li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar tileContent={getTileContent} />
    </div>
  );
}

export default CalendarView;