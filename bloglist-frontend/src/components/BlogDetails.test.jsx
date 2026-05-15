import {test, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogDetails from './BlogDetails'

const blog = {
  id: '1',
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



const renderBlogDetails = (user = null) => {
  render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={[blog]}
            likeHandler={vi.fn()}
            deleteBlogHandler={vi.fn()}
            user={user}
          />
        } />
      </Routes>
    </MemoryRouter>,
  )
}

test('blog details shown to unauthenticated user, buttons not', () => {
  renderBlogDetails()

  expect(screen.getByText('Test Author: Test Blog')).toBeInTheDocument()
  expect(screen.getByText('http://test.com')).toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()
  expect(screen.getByText('Added by root user')).toBeInTheDocument()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('blog details shown and like button to not creator user, remove button not', () => {
  const otherUser = {
    id: '456',
    username: 'other',
    name: 'other user',
  }
    
  renderBlogDetails(otherUser)

  expect(screen.getByText('Test Author: Test Blog')).toBeInTheDocument()
  expect(screen.getByText('http://test.com')).toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()
  expect(screen.getByText('Added by root user')).toBeInTheDocument()
    
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('blog details shown and like and remove buttons to creator user', () => {
  const creator = {
    id: '123',
    username: 'root',
    name: 'root user',
  }
  renderBlogDetails(creator)

  expect(screen.getByText('Test Author: Test Blog')).toBeInTheDocument()
  expect(screen.getByText('http://test.com')).toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()
  expect(screen.getByText('Added by root user')).toBeInTheDocument()
    
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})
