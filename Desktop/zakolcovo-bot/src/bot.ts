
import TelegramBot from 'node-telegram-bot-api';
import { handleStartCommand, handleTextMessage, handleCallbackQuery } from './handlers';

// --- Инициализация ---
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('[BOT] TELEGRAM_BOT_TOKEN не найден в .env файле!');
}
if (!process.env.API_KEY) {
    throw new Error('[BOT] API_KEY для Gemini не найден в .env файле!');
}

const bot = new TelegramBot(token, { polling: true });

// --- Обработчики событий ---

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  handleStartCommand(bot, msg);
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  // Игнорируем команды, так как для них есть onText
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }
  handleTextMessage(bot, msg);
});

// Обработка нажатий на inline-кнопки
bot.on('callback_query', (query) => {
  handleCallbackQuery(bot, query);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error(`[BOT] Polling error: ${error.message}`);
});

console.log('[BOT] Zakolcovo Bot запущен...');
