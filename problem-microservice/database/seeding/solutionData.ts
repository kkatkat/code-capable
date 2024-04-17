import { Solution } from "src/modules/solution/solution.entity";
import { DeepPartial } from "typeorm";


export const solutionData: DeepPartial<Solution>[] = [
    {
        id: 1,
        userId: 7,
        userName: 'kiril',
        code: `
def twoSum(nums, target):
    n = len(nums)
    for i in range(n - 1):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
`,
        problemId: 1,
        createdAt: new Date(),
    }
]