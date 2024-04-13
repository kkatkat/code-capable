export async function logInAsAdmin({ page }) {
    await page.goto('http://localhost:3333/');
    await page.getByTestId('login-button').click();
    await page.locator('#username').click();
    await page.locator('#username').fill('kiril');
    await page.locator('#username').press('Tab');
    await page.locator('#inputPassword').fill('123qwe123');
    await page.getByRole('button', { name: 'Log in' }).click();
}

const correctSolution = `
def twoSum(nums, target):
    n = len(nums)
for i in range(n - 1):
    for j in range(i + 1, n):
    if nums[i] + nums[j] == target:
    return [i, j]
\r    return []  # No solution found
`

const incorrectSolution = `
def twoSum(nums, target):
    n = len(nums)
for i in range(n - 1):
    for j in range(i + 1, n):
    if nums[i] + nums[j] == target:
    return [i, j]
\r    return [  # No solution found
`

export const testCode = (correct: boolean) => {
    if (correct) {
        return correctSolution;
    } else {
        return incorrectSolution;
    }
}
// `
// def twoSum(nums, target):
//   n = len(nums)
// for i in range(n - 1):
//   for j in range(i + 1, n):
//   if nums[i] + nums[j] == target:
//   return [i, j]
// \r  return [${correct ? ']' : ''}
// `;