import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(form)
      localStorage.setItem('token', res.token)
      navigate('/tasks')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} /><br/>
        <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} /><br/>
        <button type="submit">Login</button>
      </form>
      <a href="/register">Don't have an account? Register</a>
    </div>
  )
}