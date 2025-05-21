    type Task = {
    id: number;
    title: string;
    company: string;
    priority: 'High' | 'Medium' | 'Low';
    location: string;
    date: Date;
    status: 'Open' | 'In Progress' | 'Completed';
    };

const BASE_URL = 'http://192.168.137.1:8080/api/tasks/';

export async function getTasksByTechId(techid: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}technician/${techid}`);

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await res.json();  // parse JSON
  return data;
}

export async function getTaskById(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch task');
  }
  const data = res.json();
  return data;
}

export async function updateTaskStatus(id: number, status: 'Open' | 'In Progress' | 'Completed'): Promise<Task> {
  // First, get the current task to maintain all required fields
  const currentTask: any = await getTaskById(id);
  const currentDate = new Date();
  
  // Create the updated task object with all required fields
  const updatedTask = {
    taskID: id,
    status: status,
    description: currentTask.ticket?.description,
    assignedDate: currentTask.assignedDate || new Date().toISOString(),
    completionDate: status === 'Completed' ? currentDate.toISOString() : null,
    ticket: currentTask.ticket
  };

  const res = await fetch(`${BASE_URL}${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask)
  });
  
  if (!res.ok) {
    throw new Error('Failed to update task');
  }
  
  const data = await res.json();
  return data;
}
