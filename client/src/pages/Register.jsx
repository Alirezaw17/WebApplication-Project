import { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      alert('Registered! Please login.')
      navigate('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} /><br/>
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} /><br/>
        <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} /><br/>
        <button type="submit">Register</button>
      </form>
      <a href="/login">Already have an account? Login</a>
    </div>
  )
}