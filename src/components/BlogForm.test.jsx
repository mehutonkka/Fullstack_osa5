import {test, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls the createBlogHandler with the right details when a new blog is created', async () => {
  const createBlogHandler = vi.fn()
  const testingUser = userEvent.setup()

  render(<BlogForm createBlog={createBlogHandler} />)

  await testingUser.type(screen.getByPlaceholderText('title'), 'Test Title')
  await testingUser.type(screen.getByPlaceholderText('author'), 'Test Author')
  await testingUser.type(screen.getByPlaceholderText('url'), 'http://test.com')

  const createButton = screen.getByText('create')
  await testingUser.click(createButton)

  expect(createBlogHandler).toHaveBeenCalledTimes(1)

  expect(createBlogHandler).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
  })
})
