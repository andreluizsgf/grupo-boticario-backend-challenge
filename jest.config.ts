// jest.config.ts
import type {Config} from '@jest/types';

// Or async function
export default async (): Promise<Config.InitialOptions> => {
    return {
        preset: 'ts-jest',
        testEnvironment: 'node',
        transform: {
            'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
        },
        globalSetup: './src/test/setup.ts',
        transformIgnorePatterns: [
            '../node_modules/(?!variables/.*)'
        ],
        verbose: true,
    };
};