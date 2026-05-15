import { useState } from 'react'

const Blog = ({ blog, likeHandler, deleteBlogHandler, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

   

  let showDeleteButton = false

  if (user) {
    showDeleteButton = blog.user.id === user.id
  } 
  
  
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }
  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
      </div>

      <div>
        {blog.url}
      </div>

      <div>
        {blog.likes} likes
        <button onClick={() => likeHandler(blog)}>like</button>
      </div>

      <div>
        {blog.user.name}
      </div>
      {showDeleteButton && (
        <button onClick={() => deleteBlogHandler(blog)}>remove</button>
      )}
    </div>
  )
}
 

export default Blog
