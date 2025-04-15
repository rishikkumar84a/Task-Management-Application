'use client';

import { useState } from 'react';
import { Label, Task } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface TaskModalProps {
  task: Task & {
    labels: Label[];
  };
  isOpen: boolean;
  onClose: () => void;
}

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

type TaskFormData = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
};

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const taskPriority: Priority = 
    task.priority === 'LOW' || task.priority === 'MEDIUM' || task.priority === 'HIGH' 
      ? task.priority 
      : 'MEDIUM';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description || '',
      priority: taskPriority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      toast.success('Task updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      toast.success('Task deleted successfully');
      onClose();
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="z-10 w-full max-w-lg rounded-lg bg-white shadow-xl">
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    disabled={isLoading}
                    className="input mt-1"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-danger">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    disabled={isLoading}
                    className="input mt-1"
                    {...register('description')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      disabled={isLoading}
                      className="input mt-1"
                      {...register('priority')}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      disabled={isLoading}
                      className="input mt-1"
                      {...register('dueDate')}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-6">
                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
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
                  <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                  {task.description && (
                    <p className="text-gray-600 whitespace-pre-line">
                      {task.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                    <span className={`inline-block px-2 py-1 text-sm rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                      <span className="text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="btn btn-ghost"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 