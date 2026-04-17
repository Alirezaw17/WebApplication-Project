import { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const navigate = useNavigate()

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await createTask(form)
    setForm({ title: '', description: '' })
    fetchTasks()
  }

  const handleToggle = async (task) => {
    await updateTask(task.id, { ...task, completed: !task.completed })
    fetchTasks()
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    fetchTasks()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <h2>My Tasks</h2>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleCreate}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /><br/>
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /><br/>
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task)} />
            <b>{task.title}</b> — {task.description}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
};