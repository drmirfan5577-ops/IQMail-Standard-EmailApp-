import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
function App() {
const [session, setSession] = useState(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [emails, setEmails] = useState([])
const [selectedEmail, setSelectedEmail] = useState(null)
const [composeTo, setComposeTo] = useState('')
const [composeSubject, setComposeSubject] = useState('')
const [composeBody, setComposeBody] = useState('')
const [currentView, setCurrentView] = useState('inbox')
const [loading, setLoading] = useState(false)
useEffect(() => {
supabase.auth.getSession().then(({ data: { session } }) => {
setSession(session)
if (session) loadEmails()
})
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setSession(session)
if (session) loadEmails()
})
return () => subscription.unsubscribe()
}, [])
const loadEmails = async () => {
setLoading(true)
const { data, error } = await supabase
.from('emails')
.select('*')
.order('receivedAt', { ascending: false })
if (data) setEmails(data)
setLoading(false)
}
const handleLogin = async (e) => {
e.preventDefault()
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) alert(error.message)
}
const handleRegister = async (e) => {
e.preventDefault()
const { error } = await supabase.auth.signUp({ email, password })
if (error) alert(error.message)
else alert('Registration successful. Please login.')
}
const handleLogout = async () => {
await supabase.auth.signOut()
setEmails([])
setSelectedEmail(null)
}
const handleSendEmail = async (e) => {
e.preventDefault()
setLoading(true)
const { error } = await supabase.from('emails').insert([{
from_email: session.user.email,
to_email: composeTo,
subject: composeSubject,
textBody: composeBody,
user_id: session.user.id,
receivedAt: new Date().toISOString(),
read: false
}])
if (error) alert('Error: ' + error.message)
else {
alert('Email sent!')
setComposeTo('')
setComposeSubject('')
setComposeBody('')
setCurrentView('inbox')
loadEmails()
}
setLoading(false)
}
const deleteEmail = async (emailId) => {
await supabase.from('emails').delete().eq('id', emailId)
loadEmails()
setSelectedEmail(null)
}
if (!session) {
return (

IQMail

<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
<input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
Login


Register New Account


)
}
return (


IQMail

{session.user.email}
Logout



<button onClick={() => { setCurrentView('inbox'); setSelectedEmail(null) }} className={currentView === 'inbox' ? 'active' : ''}>Inbox
<button onClick={() => { setCurrentView('compose'); setSelectedEmail(null) }} className={currentView === 'compose' ? 'active' : ''}>Compose


{currentView === 'inbox' && !selectedEmail && (

Inbox ({emails.length})
{loading ? Loading... : emails.length === 0 ? No emails yet. : emails.map(mail => (
<div key={mail.id} className={ email-item ${mail.read ? 'read' : 'unread'} } onClick={() => { setSelectedEmail(mail) }}>
{mail.from_email}{new Date(mail.receivedAt).toLocaleDateString()}
{mail.subject}
{mail.textBody.substring(0, 100)}...

))}

)}
{selectedEmail && (

<button onClick={() => setSelectedEmail(null)} className="back-btn">Back to Inbox
{selectedEmail.subject}

From: {selectedEmail.from_email}
To: {selectedEmail.to_email}
Date: {new Date(selectedEmail.receivedAt).toLocaleString()}

{selectedEmail.textBody}
<button onClick={() => deleteEmail(selectedEmail.id)} className="delete-btn">Delete

)}
{currentView === 'compose' && (

Compose Email

<input type="email" placeholder="To: recipient@example.com" value={composeTo} onChange={e => setComposeTo(e.target.value)} required />
<input type="text" placeholder="Subject" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} required />
<textarea placeholder="Write your message..." value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={10} required />
{loading ? 'Sending...' : 'Send Email'}


)}


)
}
export default App