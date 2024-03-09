module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        "/src/interfaces/controllers/ordersRabbitmq.ts",
        "/src/interfaces/controllers/ordersRabbitmq.test.ts",
        "/interfaces/controllers/ordersRabbitmq.ts",
    ],
};