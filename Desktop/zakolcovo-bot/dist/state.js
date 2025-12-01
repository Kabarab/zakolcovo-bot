"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserState = exports.updateUserState = exports.getUserState = void 0;
// This is a simple in-memory state manager.
// For a production bot, you would replace this with a database (e.g., Redis, PostgreSQL).
const userStates = new Map();
const getInitialState = () => ({
    flow: 'IDLE',
    bookingDetails: {},
    bookingStep: null,
    cart: [],
});
const getUserState = (chatId) => {
    if (!userStates.has(chatId)) {
        userStates.set(chatId, getInitialState());
    }
    return userStates.get(chatId);
};
exports.getUserState = getUserState;
const updateUserState = (chatId, newState) => {
    const currentState = (0, exports.getUserState)(chatId);
    userStates.set(chatId, { ...currentState, ...newState });
};
exports.updateUserState = updateUserState;
const resetUserState = (chatId) => {
    userStates.set(chatId, getInitialState());
};
exports.resetUserState = resetUserState;
