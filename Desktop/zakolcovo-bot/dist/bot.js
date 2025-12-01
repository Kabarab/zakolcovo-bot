"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const handlers_1 = require("./handlers");
// --- Инициализация ---
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    throw new Error('[BOT] TELEGRAM_BOT_TOKEN не найден в .env файле!');
}
if (!process.env.API_KEY) {
    throw new Error('[BOT] API_KEY для Gemini не найден в .env файле!');
}
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// --- Обработчики событий ---
// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    (0, handlers_1.handleStartCommand)(bot, msg);
});
// Обработка текстовых сообщений
bot.on('message', (msg) => {
    // Игнорируем команды, так как для них есть onText
    if (msg.text && msg.text.startsWith('/')) {
        return;
    }
    (0, handlers_1.handleTextMessage)(bot, msg);
});
// Обработка нажатий на inline-кнопки
bot.on('callback_query', (query) => {
    (0, handlers_1.handleCallbackQuery)(bot, query);
});
// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error(`[BOT] Polling error: ${error.message}`);
});
console.log('[BOT] Zakolcovo Bot запущен...');
