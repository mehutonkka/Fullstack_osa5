import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs ),
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser',
        JSON.stringify(user),
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notificationHandler('logged in successfully')
    } catch {
      notificationHandler('wrong username or password')
    } 
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={loginHandler}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
      
  )

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat({
        ...returnedBlog,
        user: user,
      }))

      notificationHandler(`blog ${returnedBlog.title} created`)
    } catch {
      notificationHandler('creating blog failed')
    }
  }

  const likeHandler = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(blogs.map(b => b.id !== blog.id ? b : {...returnedBlog, user: blog.user} ))
  }

  const notificationHandler = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const deleteBlogHandler = async (blog) => {
    const confirm = window.confirm(`Delete blog "${blog.title}"?`)

    if (!confirm) {
      return
    }

    try {
      await blogService.remove(blog.id)
      
      setBlogs(blogs.filter(b => b.id !== blog.id))

      notificationHandler(`blog ${blog.title} deleted`)
    } catch {
      notificationHandler('deleting blog failed')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />

        <h2>Log in to application</h2>

        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} />

      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={logoutHandler}>logout</button>
      </p>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} likeHandler={likeHandler} deleteBlogHandler={deleteBlogHandler} user={user} />,
        )}
    </div>
  )
}

export default App
