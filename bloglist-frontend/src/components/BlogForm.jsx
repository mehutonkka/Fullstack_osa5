import { useState } from 'react'
import {
  FormContainer,
  FormTitle,
  Form,
  FormField,
  Label,
  Input,
  Button,
} from './FormStyles'


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
    <FormContainer>
      <FormTitle>create new</FormTitle>
      <Form onSubmit={createBlogHandler}>
        <FormField>
          <Label>title</Label>
          <Input
            placeholder='title'
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </FormField>
        <FormField>
          <Label>author</Label>
          <Input
            placeholder='author'
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </FormField>
        <FormField>
          <Label>url</Label>
          <Input
            placeholder='url'
            type="text"
            value={newUrl}
            name="Url"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </FormField>
        <Button type="submit">create</Button>
      </Form>
    </FormContainer>
  )
}

export default BlogForm
