import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080')
  await expect(page).toHaveTitle("My page")
});

test('has h1',async({page}) => {
  await page.goto('http://localhost:8080')

  const h1 = await page.locator('h1')
  await expect(h1).toHaveText('My homepage')
})

test('has image',async({page}) => {
  await page.goto('http://localhost:8080')

  const img = await page.locator('img')
  await expect(img).toHaveCount(1)
  await expect(img).toHaveAttribute("src")
})

test('has p',async({page}) => {
  await page.goto('http://localhost:8080')

  const p = await page.locator('p')
  await expect(p).toHaveCount(1)
})

test('has h2 About',async({page}) => {
  await page.goto('http://localhost:8080')

  const h2 = await page.locator('h2').first()
  await expect(h2).toHaveText('About me')
})

test('has h2 links heading',async({page}) => {
  await page.goto('http://localhost:8080')

  const h2 = await page.locator('h2').nth(1)
  await expect(h2).toHaveText('My favourite web sites')
})

test('has list',async({page}) => {
  await page.goto('http://localhost:8080')

  const lis = await page.locator('ul li')
  await expect(lis).toHaveCount(2)
})

test('has links',async({page}) => {
  await page.goto('http://localhost:8080')

  const as = await page.locator('ul li a')
  await expect(as).toHaveCount(2)
  await expect(as.first()).toHaveAttribute("href")
  await expect(as.nth(1)).toHaveAttribute("href")
})
