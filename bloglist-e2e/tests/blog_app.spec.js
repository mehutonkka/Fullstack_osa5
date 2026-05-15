const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')

        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'tester',
                name: 'Test User',
                password: 'password'
            }
        })

        await page.goto('http://localhost:5173')

    })
    
    test('Login form shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
        await expect(page.getByPlaceholder('Username')).toBeVisible()
        await expect(page.getByPlaceholder('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with right credentials', async ({ page }) => {
            await page.getByPlaceholder('Username').fill('tester')
            await page.getByPlaceholder('Password').fill('password')
            await page.getByRole('button', { name: 'login' }).click()
            
            await expect(page.getByText('Test User logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByPlaceholder('Username').fill('tester')
            await page.getByPlaceholder('Password').fill('wrongpassword')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('wrong username or password')).toBeVisible()
            await expect(page.getByText('Test User logged in')).not.toBeVisible()
        })
    })

    describe('After login', () => {
        beforeEach(async ({ page }) => {
            await page.getByPlaceholder('Username').fill('tester')
            await page.getByPlaceholder('Password').fill('password')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Test Blog')
            await page.getByPlaceholder('author').fill('Test Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Test Blog Test Author')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Likable Blog')
            await page.getByPlaceholder('author').fill('Test Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Likable Blog Test Author')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()

            await expect(page.getByText('1 likes')).toBeVisible()
        })

        test('blog can be deleted by creator', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Deletable Blog')
            await page.getByPlaceholder('author').fill('Test Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Deletable Blog Test Author')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()

            page.on('dialog', async dialog => {
                expect(dialog.message()).toBe('Delete blog "Deletable Blog"?')
                await dialog.accept()
            })

            await page.getByRole('button', { name: 'remove' }).click()

            

            await expect(page.getByText('Deletable Blog Test Author')).not.toBeVisible()
        })

        test('only creator can see delete button', async ({ page, request }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Test Blog')
            await page.getByPlaceholder('author').fill('Test Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Test Blog Test Author')).toBeVisible()

            await request.post('http://localhost:3003/api/users', {
                data: {
                    username: 'tester2',
                    name: '2nd Test User',
                    password: 'password'
                }
            })

            await page.getByRole('button', { name: 'logout' }).click()

            await page.getByPlaceholder('Username').fill('tester2')
            await page.getByPlaceholder('Password').fill('password')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Test Blog Test Author')).toBeVisible()
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs ordered by likes', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Worst Blog')
            await page.getByPlaceholder('author').fill('Worst Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Worst Blog Worst Author')).toBeVisible()

            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Middle Blog')
            await page.getByPlaceholder('author').fill('Middle Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Middle Blog Middle Author')).toBeVisible()

            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill('Best Blog')
            await page.getByPlaceholder('author').fill('Best Author')
            await page.getByPlaceholder('url').fill('http://test.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Best Blog Best Author')).toBeVisible()

            const blogs = page.locator('.blog')

            const leastLiked = blogs.filter({ hasText: 'Worst Blog' })
            const middleLiked = blogs.filter({ hasText: 'Middle Blog' })
            const mostLiked = blogs.filter({ hasText: 'Best Blog' })

            await leastLiked.getByRole('button', { name: 'view' }).click()
            await middleLiked.getByRole('button', { name: 'view' }).click()
            await mostLiked.getByRole('button', { name: 'view' }).click()

            await leastLiked.getByRole('button', { name: 'like' }).click()
            
            await middleLiked.getByRole('button', { name: 'like' }).click()
            await middleLiked.getByRole('button', { name: 'like' }).click()

            await mostLiked.getByRole('button', { name: 'like' }).click()
            await mostLiked.getByRole('button', { name: 'like' }).click()
            await mostLiked.getByRole('button', { name: 'like' }).click()

            await expect(leastLiked).toHaveText(/1 likes/)
            await expect(middleLiked).toHaveText(/2 likes/)
            await expect(mostLiked).toHaveText(/3 likes/)

            const blogsAfterLikes = page.locator('.blog')

            await expect(blogsAfterLikes.nth(0)).toContainText('Best Blog')
            await expect(blogsAfterLikes.nth(1)).toContainText('Middle Blog')
            await expect(blogsAfterLikes.nth(2)).toContainText('Worst Blog')
        })

            
    })
        

})
