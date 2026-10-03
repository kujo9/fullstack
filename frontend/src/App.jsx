import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    const response = await fetch(`${API_URL}/todos`)
    setTodos(await response.json())
  }

  async function saveTodo(event) {
    event.preventDefault()

    const todo = { Title: title.trim(), Description: description.trim() || null }
    const url = editingId ? `${API_URL}/todos/${editingId}` : `${API_URL}/todos`
    const method = editingId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })

    setTitle('')
    setDescription('')
    setEditingId(null)
    await loadTodos()
  }

  function startEditing(todo) {
    setEditingId(todo.Id)
    setTitle(todo.Title)
    setDescription(todo.Description || '')
  }

  function cancelEditing() {
    setEditingId(null)
    setTitle('')
    setDescription('')
  }

  async function toggleCompleted(todo) {
    await fetch(`${API_URL}/todos/${todo.Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Title: todo.Title,
        Description: todo.Description,
        IsCompleted: !todo.IsCompleted,
      }),
    })
    await loadTodos()
  }

  async function deleteTodo(id) {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
    if (editingId === id) cancelEditing()
    await loadTodos()
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.IsCompleted
    if (filter === 'completed') return todo.IsCompleted
    return true
  })
  const remainingCount = todos.filter((todo) => !todo.IsCompleted).length

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Daymark home">
          <span className="wordmark-icon" aria-hidden="true">D</span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A little more focus, every day.</span>
      </header>

      <div className="workspace" id="top">
        <section className="intro">
          <p className="eyebrow">YOUR PERSONAL TODO LIST</p>
          <h1>Make room<br />for what matters.</h1>
          <p className="intro-copy">Small steps count. Get them out of your head and onto the page.</p>
          <div className="daily-count">
            <span className="count-number">{remainingCount}</span>
            <span>{remainingCount === 1 ? 'task' : 'tasks'} left to do</span>
          </div>
          <div className="intro-rule" />
          <p className="date-note">A clear list is a good place to start.</p>
        </section>

        <section className="todo-area" aria-label="Todo list">
          <form className="todo-form" onSubmit={saveTodo}>
            <div className="form-heading">
              <div>
                <p className="eyebrow">{editingId ? 'MAKE A CHANGE' : 'CAPTURE A THOUGHT'}</p>
                <h2>{editingId ? 'Edit task' : 'Add a task'}</h2>
              </div>
              {editingId && (
                <button className="text-button" type="button" onClick={cancelEditing}>
                  Cancel
                </button>
              )}
            </div>
            <label htmlFor="todo-title">Title</label>
            <input
              id="todo-title"
              maxLength="200"
              placeholder="What needs doing?"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <label htmlFor="todo-description">Description <span>(optional)</span></label>
            <textarea
              id="todo-description"
              placeholder="Add a few details..."
              rows="3"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <button className="primary-button" type="submit">
              {editingId ? 'Save changes' : 'Add to my list'}
            </button>
          </form>

          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR TASKS</p>
              <h2>Todo list <span className="list-count">{todos.length}</span></h2>
            </div>
            <div className="filter-tabs" aria-label="Filter tasks">
              {['all', 'active', 'completed'].map((filterName) => (
                <button
                  aria-pressed={filter === filterName}
                  className={filter === filterName ? 'filter-button selected' : 'filter-button'}
                  key={filterName}
                  onClick={() => setFilter(filterName)}
                  type="button"
                >
                  {filterName[0].toUpperCase() + filterName.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="todo-list">
            {visibleTodos.length === 0 ? (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true">+</span>
                <p>{todos.length === 0 ? 'Your list is a blank page.' : 'Nothing in this view yet.'}</p>
                <span>{todos.length === 0 ? 'Add a task above to get started.' : 'Try another filter.'}</span>
              </div>
            ) : visibleTodos.map((todo) => (
              <article className={todo.IsCompleted ? 'todo-row completed' : 'todo-row'} key={todo.Id}>
                <button
                  aria-label={todo.IsCompleted ? `Mark ${todo.Title} active` : `Mark ${todo.Title} complete`}
                  className="completion-toggle"
                  onClick={() => toggleCompleted(todo)}
                  title={todo.IsCompleted ? 'Mark active' : 'Mark complete'}
                  type="button"
                >
                  {todo.IsCompleted ? '✓' : ''}
                </button>
                <div className="todo-content">
                  <h3>{todo.Title}</h3>
                  {todo.Description && <p className="todo-description">{todo.Description}</p>}
                  <p className="todo-date">
                    Added {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(todo.DateCreated))}
                  </p>
                </div>
                <div className="todo-actions">
                  <button className="text-button" onClick={() => startEditing(todo)} type="button">Edit</button>
                  <button className="text-button delete-button" onClick={() => deleteTodo(todo.Id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <footer className="page-footer">One thing at a time.</footer>
    </main>
  )
}

export default App
