
import { UserState } from './types';

// This is a simple in-memory state manager.
// For a production bot, you would replace this with a database (e.g., Redis, PostgreSQL).
const userStates = new Map<number, UserState>();

const getInitialState = (): UserState => ({
  flow: 'IDLE',
  bookingDetails: {},
  bookingStep: null,
  cart: [],
});

export const getUserState = (chatId: number): UserState => {
  if (!userStates.has(chatId)) {
    userStates.set(chatId, getInitialState());
  }
  return userStates.get(chatId)!;
};

export const updateUserState = (chatId: number, newState: Partial<UserState>) => {
  const currentState = getUserState(chatId);
  userStates.set(chatId, { ...currentState, ...newState });
};

export const resetUserState = (chatId: number) => {
  userStates.set(chatId, getInitialState());
};
