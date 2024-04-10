export async function logInAsAdmin({ page }) {
    await page.goto('http://localhost:3333/');
    await page.getByTestId('login-button').click();
    await page.locator('#username').click();
    await page.locator('#username').fill('kiril');
    await page.locator('#username').press('Tab');
    await page.locator('#inputPassword').fill('123qwe123');
    await page.getByRole('button', { name: 'Log in' }).click();
}