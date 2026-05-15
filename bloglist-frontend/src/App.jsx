import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import BlogDetails from './components/BlogDetails'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

import {
  FormContainer,
  FormTitle,
  Form,
  FormField,
  Label,
  Input,
  Button,
} from './components/FormStyles'

import {
  NavBar,
  NavLink,
  NavUser,
  LogoutButton,
} from './components/NavStyles'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

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
      navigate('/')
      notificationHandler('logged in successfully')
    } catch {
      notificationHandler('wrong username or password')
    } 
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    navigate('/')
  }

  const loginForm = () => (
    <FormContainer>
      <FormTitle>Log in to application</FormTitle>
      <Form onSubmit={loginHandler}>
        <FormField>
          <Label>Username</Label>
          <Input
            placeholder="Username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </FormField>
        <FormField>
          <Label>Password</Label>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </FormField>
        <Button type="submit">login</Button>
      </Form>
    </FormContainer>
      
  )

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat({
        ...returnedBlog,
        user: user,
      }))

      notificationHandler(`blog ${returnedBlog.title} created`)
      navigate('/')
    } catch {
      notificationHandler('creating blog failed')
    }
  }

  const likeHandler = async (blog) => {
    if (!user) {
      return
    }

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
      navigate('/')
    } catch {
      notificationHandler('deleting blog failed')
    }
  }

  const BlogList = () => (
    <div>

      <h2>blogs</h2>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>,
        )}
    </div>
  )

  const CreateBlogView = () => {
    if (!user) {
      return null
    }

    return (
      <div>
        <BlogForm createBlog={createBlog} />
      </div>
    )
  }



  return (
    <div>
      <NavBar>
        <NavLink style={{ padding: 5 }} to="/">blogs</NavLink>
        {user && (
          <NavLink style={{ padding: 5 }} to="/create">new blog</NavLink>
        )}
        {!user && (
          <NavLink style={{ padding: 5 }} to="/login">login</NavLink>
        )}
        {user && (
          <span>
            {user.name} logged in{' '}
            <LogoutButton onClick={logoutHandler}>logout</LogoutButton>
          </span>
        )}
      </NavBar>

      <Notification message={notification} />
      <Routes>
        <Route path="/login" element={loginForm()} />
        <Route path="/" element={BlogList()} />
        <Route path="/create" element={<CreateBlogView />} />
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={blogs}
            likeHandler={likeHandler}
            user={user}
            deleteBlogHandler={deleteBlogHandler}
          />
        } />
      </Routes>
    </div>


  )
}

export default App
