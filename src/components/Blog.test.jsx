import {test, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      id: '123',
      username: 'root',
      name: 'root user',
    },
  }

  const user = {
    id: '123',
    username: 'root',
    name: 'root user',
  }

  render(
    <Blog
      blog={blog}
      likeHandler={() => {}}
      deleteBlogHandler={() => {}}
      user={user}
    />,
  )

  screen.getByText('Test Blog Test Author')

  expect(screen.queryByText('/http://test.com/')).toBeNull()
  expect(screen.queryByText('/5 likes/')).toBeNull()
})

test('renders url, user and likes when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      id: '123',
      username: 'root',
      name: 'root user',
    },
  }  
  const user = {
    id: '123',
    username: 'root',
    name: 'root user',
  }  
  const testingUser = userEvent.setup()  
  render(
    <Blog
      blog={blog}
      likeHandler={() => {}}
      deleteBlogHandler={() => {}}
      user={user}
    />,
  )
  
  const button = screen.getByText('view')
  await testingUser.click(button)  
  screen.getByText('http://test.com')
  screen.getByText('5 likes')
  screen.getByText('root user')
})

test('clicking like twice calls the handler twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      id: '123',
      username: 'root',
      name: 'root user',
    },
  }  
  const user = {
    id: '123',
    username: 'root',
    name: 'root user',
  }
  const mockHandler = vi.fn()
  const testingUser = userEvent.setup()
  render(
    <Blog
      blog={blog}
      likeHandler={mockHandler}
      deleteBlogHandler={() => {}}
      user={user}
    />,
  )
  const viewButton = screen.getByText('view')
  await testingUser.click(viewButton)
  const likeButton = screen.getByText('like')
  await testingUser.click(likeButton)
  await testingUser.click(likeButton)
  
  expect(mockHandler).toHaveBeenCalledTimes(2)
})
