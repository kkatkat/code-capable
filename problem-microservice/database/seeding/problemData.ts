import { Problem } from "src/modules/problem/problem.entity";
import { DeepPartial } from "typeorm";

export const problemData: DeepPartial<Problem>[] = [
    {
        id: 1,
        name: 'Two sum',
        description: `
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

        You may assume that each input would have exactly one solution, and you may not use the same element twice.

        You can return the answer in any order.
        `,
        difficulty: 'easy',
        starterCode: `def twoSum(nums, target):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 1,
                code: `assert twoSum([2,7,11,15], 9) == [0,1]`,
                visible: true,
                problemId: 1
            },
            {
                id: 2,
                code: `assert twoSum([3,2,4], 6) == [1,2]`,
                visible: true,
                problemId: 1
            },
            {
                id: 3,
                code: `assert twoSum([3,3], 6) == [0,1]`,
                visible: false,
                problemId: 1
            }
        ]
    },
    {
        id: 2,
        name: 'Add Two Numbers',
        description: `
        You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

        You may assume the two numbers do not contain any leading zero, except the number 0 itself.
        `,
        difficulty: 'medium',
        starterCode: `def addTwoNumbers(l1, l2):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 4,
                code: `assert addTwoNumbers([2,4,3], [5,6,4]) == [7,0,8]`,
                visible: true,
                problemId: 2
            },
            {
                id: 5,
                code: `assert addTwoNumbers([0], [0]) == [0]`,
                visible: true,
                problemId: 2
            },
            {
                id: 6,
                code: `assert addTwoNumbers([9,9,9,9,9,9,9], [9,9,9,9]) == [8,9,9,9,0,0,0,1]`,
                visible: false,
                problemId: 2
            }
        ]
    },
    {
        id: 3,
        name: 'Longest Substring Without Repeating Characters',
        description: `
        Given a string s, find the length of the longest substring without repeating characters.
        `,
        difficulty: 'medium',
        starterCode: `def lengthOfLongestSubstring(s):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 7,
                code: `assert lengthOfLongestSubstring("abcabcbb") == 3`,
                visible: true,
                problemId: 3
            },
            {
                id: 8,
                code: `assert lengthOfLongestSubstring("bbbbb") == 1`,
                visible: true,
                problemId: 3
            },
            {
                id: 9,
                code: `assert lengthOfLongestSubstring("pwwkew") == 3`,
                visible: false,
                problemId: 3
            }
        ]
    },
    {
        id: 4,
        name: 'Median of Two Sorted Arrays',
        description: `
        Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

        The overall run time complexity should be O(log (m+n)).
        `,
        difficulty: 'hard',
        starterCode: `def findMedianSortedArrays(nums1, nums2):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 10,
                code: `assert findMedianSortedArrays([1,3], [2]) == 2.0`,
                visible: true,
                problemId: 4
            },
            {
                id: 11,
                code: `assert findMedianSortedArrays([1,2], [3,4]) == 2.5`,
                visible: true,
                problemId: 4
            },
        ],
        constraints: `
        * nums1.length == m
        * nums2.length == n
        * 0 <= m <= 1000
        * 0 <= n <= 1000
        * 1 <= m + n <= 2000
        * -10^6 <= nums1[i], nums2[i] <= 10^6
        `
    },
    {
        id: 5,
        name: 'Longest Palindromic Substring',
        description: `
        Given a string s, return the longest palindromic substring in s.
        `,
        difficulty: 'medium',
        starterCode: `def longestPalindrome(s):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 12,
                code: `assert longestPalindrome("babad") == "bab"`,
                visible: true,
                problemId: 5
            },
            {
                id: 13,
                code: `assert longestPalindrome("cbbd") == "bb"`,
                visible: true,
                problemId: 5
            },
        ]
    },
    {
        id: 6,
        name: 'ZigZag Conversion',
        description: `
        The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this:

        P   A   H   N
        A P L S I I G
        Y   I   R

        And then read line by line: "PAHNAPLSIIGYIR"

        Write the code that will take a string and make this conversion given a number of rows.
        `,
        difficulty: 'medium',
        starterCode: `def convert(s, numRows):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 14,
                code: `assert convert("PAYPALISHIRING", 3) == "PAHNAPLSIIGYIR"`,
                visible: true,
                problemId: 6
            },
            {
                id: 15,
                code: `assert convert("PAYPALISHIRING", 4) == "PINALSIGYAHRPI"`,
                visible: true,
                problemId: 6
            },
        ]
    },
    {
        id: 7,
        name: 'Reverse Integer',
        description: `
        Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.
        `,
        difficulty: 'easy',
        starterCode: `def reverse(x):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 16,
                code: `assert reverse(123) == 321`,
                visible: true,
                problemId: 7
            },
            {
                id: 17,
                code: `assert reverse(-123) == -321`,
                visible: true,
                problemId: 7
            },
            {
                id: 18,
                code: `assert reverse(120) == 21`,
                visible: false,
                problemId: 7
            },
        ]
    },
    {
        id: 8,
        name: 'String to Integer (atoi)',
        description: `
        Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function).

        The algorithm for myAtoi(string s) is as follows:

        1. Read in and ignore any leading whitespace.
        2. Check if the next character (if not already at the end of the string) is '-' or '+'. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.
        3. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.
        4. Convert these digits into an integer (i.e. "123" -> 123, "0032" -> 32). If no digits were read, then the integer is 0. Change the sign as necessary (from step 2).
        5. If the integer is out of the 32-bit signed integer range [-231, 231 - 1], then clamp the integer so that it remains in the range. Specifically, integers less than -231 should be clamped to -231, and integers greater than 231 - 1 should be clamped to 231 - 1.
        6. Return the integer as the final result.

        **Note**:
        - Only the space character \`' '\` is considered a whitespace character.
        - Do not ignore any characters other than the leading whitespace or the rest of the string after the digits.
        `,
        difficulty: 'medium',
        starterCode: `def myAtoi(s):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 19,
                code: `assert myAtoi("42") == 42`,
                visible: true,
                problemId: 8
            },
            {
                id: 20,
                code: `assert myAtoi("   -42") == -42`,
                visible: true,
                problemId: 8
            },
            {
                id: 21,
                code: `assert myAtoi("4193 with words") == 4193`,
                visible: false,
                problemId: 8
            },
        ]
    },
    {
        id: 9,
        name: 'Palindrome Number',
        description: `
        Given an integer x, return true if x is a palindrome integer.

        An integer is a palindrome when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.
        `,
        difficulty: 'easy',
        starterCode: `def isPalindrome(x):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 22,
                code: `assert isPalindrome(121) == True`,
                visible: true,
                problemId: 9
            },
            {
                id: 23,
                code: `assert isPalindrome(-121) == False`,
                visible: true,
                problemId: 9
            },
            {
                id: 24,
                code: `assert isPalindrome(10) == False`,
                visible: false,
                problemId: 9
            },
        ]
    },
    {
        id: 10,
        name: 'Regular Expression Matching',
        description: `
        Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

        - '.' Matches any single character.
        - '*' Matches zero or more of the preceding element.

        The matching should cover the entire input string (not partial).
        `,
        difficulty: 'hard',
        starterCode: `def isMatch(s, p):`,
        approved: true,
        creatorId: 1,
        unitTests: [
            {
                id: 25,
                code: `assert isMatch("aa", "a") == False`,
                visible: true,
                problemId: 10
            },
            {
                id: 26,
                code: `assert isMatch("aa", "a*") == True`,
                visible: true,
                problemId: 10
            },
            {
                id: 27,
                code: `assert isMatch("ab", ".*") == True`,
                visible: false,
                problemId: 10
            },
        ]
    }
]