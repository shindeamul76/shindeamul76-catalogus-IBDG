'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskData } from '@/types/task-type';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/get-tasks');
    const data = await response.json();
    setTasks(data.tasks);
  };

  const handleSubmit = async () => {
    if (!imageUrl) return;

    const response = await fetch('/api/submit-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    if (response.ok) {
      setImageUrl('');
      fetchTasks();
    }
  };

  const handleTaskClick = (task: TaskData) => {
    console.log('Task clicked:', task);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">IMAGE-BASED DATA GENERATION</h1>
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md"> 
        <div className="flex space-x-2 mb-4">
          <Input
            className="flex-grow h-12"
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button className="flex-grow h-12 transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700 text-white" onClick={handleSubmit}>Submit</Button>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-blue-700">Task Lists</h2>
        <div className="space-y-4">
          {currentTasks.map((task) => (
            <Card key={task.taskId} className="p-4 flex items-center justify-between border rounded-lg shadow-sm cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200" onClick={() => handleTaskClick(task)}>
              <div className="flex items-center space-x-4">
                <img src={task.imageUrl} alt="task" className="w-14 h-14 rounded-full object-cover" />
              </div>
              <div className="flex justify-center text-center space-y-2">
                <p className="text-sm font-medium">Task ID: {task.taskId}</p>
              </div>
              <Badge className={`w-24 flex justify-center text-center py-1 rounded-md text-white font-semibold ${
                task.status === 'Success' ? 'bg-green-500' :
                task.status === 'Failed' ? 'bg-red-500' :
                task.status === 'Processing' ? 'bg-yellow-500 text-black' : 'bg-gray-500'
              }`}>
                {task.status}
              </Badge>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center mt-6 space-x-4">
          <Button className="transition duration-300 ease-in-out hover:bg-gray-300" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            <ChevronLeft />
          </Button>
          <p className="text-lg font-medium">{currentPage} / {totalPages}</p>
          <Button className="transition duration-300 ease-in-out hover:bg-gray-300" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}