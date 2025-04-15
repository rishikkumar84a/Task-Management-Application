'use client';

import { Label, Task } from '@prisma/client';
import { useState } from 'react';
import TaskModal from '@/app/components/TaskModal';

interface TaskCardProps {
  task: Task & {
    labels: Label[];
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-danger/20 text-danger';
      case 'LOW':
        return 'bg-success/20 text-success';
      default:
        return 'bg-warning/20 text-warning';
    }
  };
  
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;
    
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="card bg-white p-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className="px-2 py-0.5 text-xs rounded-full"
                style={{ backgroundColor: label.color, color: '#fff' }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-medium mb-1">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {task.priority && (
            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          )}
          {formattedDate && (
            <span className={`text-xs ${isOverdue ? 'text-danger' : 'text-gray-500'}`}>
              {formattedDate}
            </span>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <TaskModal
          task={task}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
} 