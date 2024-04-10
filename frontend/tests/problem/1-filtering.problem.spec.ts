import { Page, expect, test } from "@playwright/test";

test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
})

test.afterAll(async () => {
    await page.close();
});

test('Load problems', async () => {
    await page.getByRole('link', { name: 'Problems', exact: true }).click();

    const problemsAmount = await page.$$eval('.hoverable-card', elements => elements.length);
    expect(problemsAmount).toBeGreaterThan(0);
})

test('Filter by difficulty', async () => {
    await page.locator('div').filter({ hasText: /^DifficultyEasyMediumHard$/ }).getByRole('combobox').selectOption('easy');
    await page.getByTestId('filter-button').click();

    const problemsAmount = await page.$$eval('.hoverable-card', elements => elements.length);
    expect(problemsAmount).toBe(2);
})

test('Search problems', async () => {
    await page.getByTestId('filter-clear-button').click();
    await page.getByPlaceholder('Search', { exact: true }).click();
    await page.getByPlaceholder('Search', { exact: true }).fill('atoi');
    await page.getByTestId('filter-button').click();
    
    const problemsAmount = await page.$$eval('.hoverable-card', elements => elements.length);
    expect(problemsAmount).toBe(1);
})



//test('Filter by difficulty')
