import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const createBlogHandler = async (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlogHandler}>
        <div>
            title:
          <input
            placeholder='title'
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
            author:
          <input
            placeholder='author'
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
            url:
          <input
            placeholder='url'
            type="text"
            value={newUrl}
            name="Url"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
