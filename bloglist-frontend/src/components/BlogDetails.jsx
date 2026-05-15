import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const BlogCard = styled.div`
  max-width: 700px;
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const BlogTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  color: #222;
`

const BlogMeta = styled.div`
  margin-bottom: 12px;
  color: #555;
`

const BlogLink = styled.a`
  color: #cc8625;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const BlogActions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
`

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #cc8625;
  color: white;
  cursor: pointer;

  &:hover {
    background: #94631d;
  }
`

const RemoveButton = styled(Button)`
  background: #d32f2f;

  &:hover {
    background: #9a0007;
  }
`


const BlogDetails = ({blogs, likeHandler, user, deleteBlogHandler }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  let showDeleteButton = false

  if (user) {
    showDeleteButton = blog.user.id === user.id
  } 

  
  return (
    <BlogCard>
      <BlogTitle>{blog.author}: {blog.title}</BlogTitle>
      <BlogMeta>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </BlogMeta>
      <BlogActions>
        {blog.likes} likes{' '}
        {user && (
          <Button onClick={() => likeHandler(blog)}>
            like
          </Button>
        )}
      </BlogActions>
      <br/>
      <BlogMeta>
        Added by {blog.user.name}
      </BlogMeta>
      {showDeleteButton && (
        <RemoveButton onClick={() => deleteBlogHandler(blog)}>
          remove
        </RemoveButton>
      )}
    </BlogCard>
  )
}

export default BlogDetails
