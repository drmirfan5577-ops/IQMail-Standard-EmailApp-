import React, { useState } from 'react'
import './App.css'

interface Email {
  id: string
  from: string
  to: string
  subject: string
  body: string
  date: string
}

function App() {
  const [emails, setEmails] = useState<Email[]>([])
  const [currentView, setCurrentView] = useState<'inbox' | 'compose'>('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const newEmail: Email = {
      id: Date.now().toString(),
      from: 'me@iqmail.online',
      to,
      subject,
      body,
      date: new Date().toLocaleString()
    }
    setEmails([newEmail, ...emails])
    setTo('')
    setSubject('')
    setBody('')
    setCurrentView('inbox')
    alert('Email sent!')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📧 IQMail</h1>
        <p>Simple Email App</p>
      </header>

      <nav className="nav">
        <button onClick={() => { setCurrentView('inbox'); setSelectedEmail(null) }}>
          📥 Inbox ({emails.length})
        </button>
        <button onClick={() => setCurrentView('compose')}>
          ✉️ Compose
        </button>
      </nav>

      <main className="main">
        {currentView === 'inbox' && !selectedEmail && (
          <div className="inbox">
            <h2>Your Emails</h2>
            {emails.length === 0 ? (
              <p className="empty">No emails yet. Start composing!</p>
            ) : (
              emails.map(email => (
                <div key={email.id} className="email-card" onClick={() => setSelectedEmail(email)}>
                  <div className="email-from"><strong>From:</strong> {email.from}</div>
                  <div className="email-to"><strong>To:</strong> {email.to}</div>
                  <div className="email-subject"><strong>Subject:</strong> {email.subject}</div>
                  <div className="email-date">{email.date}</div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedEmail && (
          <div className="email-view">
            <button onClick={() => setSelectedEmail(null)} className="back-btn">← Back</button>
            <h2>{selectedEmail.subject}</h2>
            <p><strong>From:</strong> {selectedEmail.from}</p>
            <p><strong>To:</strong> {selectedEmail.to}</p>
            <p><strong>Date:</strong> {selectedEmail.date}</p>
            <div className="email-body">{selectedEmail.body}</div>
          </div>
        )}

        {currentView === 'compose' && (
          <form className="compose-form" onSubmit={handleSend}>
            <h2>Compose Email</h2>
            <input
              type="email"
              placeholder="To: recipient@example.com"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Write your message..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={10}
              required
            />
            <button type="submit">📤 Send Email</button>
          </form>
        )}
      </main>
    </div>
  )
}

export default App