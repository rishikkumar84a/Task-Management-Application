'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Board, Column, Task, Label } from '@prisma/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TaskCard from '@/app/components/TaskCard';
import CreateTaskButton from '@/app/components/CreateTaskButton';

type ColumnWithTasks = Column & {
  tasks: (Task & {
    labels: Label[];
  })[];
};

type BoardWithColumns = Board & {
  columns: ColumnWithTasks[];
};

interface KanbanBoardProps {
  board: BoardWithColumns;
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const router = useRouter();
  const [columns, setColumns] = useState<ColumnWithTasks[]>(board.columns);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // If we're dragging columns
    if (type === 'column') {
      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);
      
      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));
      
      setColumns(updatedColumns);
      
      // Update column order in the database
      try {
        await Promise.all(
          updatedColumns.map((column) =>
            fetch(`/api/columns/${column.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ order: column.order }),
            })
          )
        );
      } catch (error) {
        toast.error('Failed to update column order');
      }
      
      return;
    }
    
    // If we're dragging tasks
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    
    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    const destinationColumn = columns.find((col) => col.id === destinationColumnId);
    
    if (!sourceColumn || !destinationColumn) return;
    
    // If moving tasks within the same column
    if (sourceColumnId === destinationColumnId) {
      const newTasks = [...sourceColumn.tasks];
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      
      const newColumns = columns.map((col) => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: newTasks,
          };
        }
        return col;
      });
      
      setColumns(newColumns);
      
      // No need to update task order in database for this version
      return;
    }
    
    // Moving tasks between columns
    const sourceTasks = [...sourceColumn.tasks];
    const destinationTasks = [...destinationColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);
    
    const newColumns = columns.map((col) => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          tasks: sourceTasks,
        };
      }
      if (col.id === destinationColumnId) {
        return {
          ...col,
          tasks: destinationTasks,
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    
    // Update task column in the database
    try {
      await fetch(`/api/tasks/${movedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columnId: destinationColumnId }),
      });
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-4 overflow-x-auto pb-4"
          >
            {columns.map((column, index) => (
              <Draggable
                key={column.id}
                draggableId={column.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex-shrink-0 w-80"
                  >
                    <div className="bg-gray-100 rounded-lg shadow">
                      <div
                        {...provided.dragHandleProps}
                        className="p-3 font-medium bg-gray-200 rounded-t-lg flex items-center justify-between"
                      >
                        {column.name}
                        <span className="text-gray-500 text-sm">
                          {column.tasks.length}
                        </span>
                      </div>
                      <Droppable droppableId={column.id} type="task">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-2 min-h-[6rem] max-h-[calc(100vh-15rem)] overflow-y-auto ${
                              snapshot.isDraggingOver ? 'bg-gray-200' : ''
                            }`}
                          >
                            {column.tasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-2"
                                  >
                                    <TaskCard task={task} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <div className="p-2">
                        <CreateTaskButton columnId={column.id} />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 