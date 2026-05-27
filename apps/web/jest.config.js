// next/jest 가 Next.js 환경 (tsconfig path, .env, css 모듈) 을 자동 처리.
// 공식 패턴: https://nextjs.org/docs/pages/building-your-application/testing/jest
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
	testEnvironment: 'jest-environment-jsdom',
	testMatch: ['<rootDir>/__tests__/**/*.test.{js,jsx}'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
};

module.exports = createJestConfig(customJestConfig);
