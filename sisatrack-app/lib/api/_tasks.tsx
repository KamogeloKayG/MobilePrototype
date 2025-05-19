    type Task = {
    id: number;
    title: string;
    company: string;
    priority: 'High' | 'Medium' | 'Low';
    location: string;
    date: Date;
    status: 'Open' | 'In Progress' | 'Completed';
    };

const BASE_URL = 'http://192.168.137.1:8080/api/tasks/technician'; // change to match your Spring backend

export async function getTasksByTechId(techid: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/${techid}`);
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await res.json();  // parse JSON
  console.log(data);              // now logs actual task data
  return data;
}

export async function getTaskById(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch task');
  }
  return res.json();
}
