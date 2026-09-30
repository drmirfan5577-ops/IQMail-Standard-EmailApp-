import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Registration successful! Please verify your email.')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return (
      <div className="auth-container">
        <h2>IQMail Login / Register</h2>
        <form onSubmit={handleSignIn}>
          <input type="email" placeholder="Email (e.g., info@iqmail.online)" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <button type="button" onClick={handleSignUp}>Register New Account</button>
        </form>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header>
        <h2>Welcome, {session.user.email}</h2>
        <button onClick={handleSignOut}>Logout</button>
      </header>
      <main className="glass-panel">
        <h3>I_box (Inbox)</h3>
        <p>Emails will appear here after Supabase integration.</p>
      </main>
    </div>
  )
}

export default App