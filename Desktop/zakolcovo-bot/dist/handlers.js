"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallbackQuery = exports.handleTextMessage = exports.handleStartCommand = void 0;
const state_1 = require("./state");
const gemini_1 = require("./gemini");
const constants_1 = require("./constants");
const sendMainMenu = (bot, chatId, text) => {
    bot.sendMessage(chatId, text, {
        reply_markup: {
            keyboard: [
                [{ text: 'Посмотреть меню 🍽️' }],
                [{ text: 'Забронировать стол 📅' }],
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
        },
    });
};
const handleStartCommand = (bot, msg) => {
    const chatId = msg.chat.id;
    (0, state_1.resetUserState)(chatId);
    const welcomeText = `Здравствуйте, ${msg.from?.first_name || 'Гость'}! Я бот-помощник ресторана "Закольцово". Чем могу помочь?`;
    sendMainMenu(bot, chatId, welcomeText);
};
exports.handleStartCommand = handleStartCommand;
const startBookingProcess = (bot, chatId) => {
    (0, state_1.updateUserState)(chatId, { flow: 'BOOKING', bookingStep: 'guests' });
    bot.sendMessage(chatId, 'На сколько гостей бронируем столик?', {
        reply_markup: { remove_keyboard: true },
    });
};
const startOrderingProcess = async (bot, chatId) => {
    (0, state_1.updateUserState)(chatId, { flow: 'ORDERING' });
    await bot.sendMessage(chatId, 'Вот наше меню. Вы можете добавлять блюда в корзину. Когда закончите, нажмите "Посмотреть корзину".', {
        reply_markup: {
            keyboard: [[{ text: 'Посмотреть корзину 🛒' }], [{ text: 'Главное меню ↩️' }]],
            resize_keyboard: true,
        },
    });
    for (const item of constants_1.MENU_ITEMS) {
        const caption = `*${item.name}*\n\n${item.description}\n\n*Цена:* ${item.price} BYN`;
        try {
            // Пытаемся отправить фото
            await bot.sendPhoto(chatId, item.image, {
                caption: caption,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: 'Добавить в корзину ➕', callback_data: `cart_add_${item.id}` }]],
                },
            });
        }
        catch (error) {
            // Если не получилось, логируем ошибку и отправляем только текст
            let errorMessage = 'Неизвестная ошибка';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error(`[BOT] Не удалось отправить фото для "${item.name}". URL: ${item.image}. Ошибка: ${errorMessage}`);
            const textFallback = `${caption}\n\n_(Изображение не удалось загрузить)_`;
            await bot.sendMessage(chatId, textFallback, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: 'Добавить в корзину ➕', callback_data: `cart_add_${item.id}` }]],
                },
            });
        }
    }
};
const viewCart = (bot, chatId) => {
    const state = (0, state_1.getUserState)(chatId);
    if (state.cart.length === 0) {
        bot.sendMessage(chatId, 'Ваша корзина пуста.');
        return;
    }
    (0, state_1.updateUserState)(chatId, { flow: 'CHECKOUT' });
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let cartText = '🛒 *Ваша корзина:*\n\n';
    state.cart.forEach(item => {
        cartText += `*${item.name}* (x${item.quantity}) - ${item.price * item.quantity} BYN\n`;
    });
    cartText += `\n*Итого:* ${total} BYN`;
    bot.sendMessage(chatId, cartText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Подтвердить заказ ✅', callback_data: 'cart_confirm' }],
                [{ text: 'Очистить корзину 🗑️', callback_data: 'cart_clear' }],
                [{ text: 'Продолжить выбор 🍽️', callback_data: 'continue_ordering' }],
            ],
        },
    });
};
const handleTextMessage = async (bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const state = (0, state_1.getUserState)(chatId);
    // Handle main menu options
    if (text === 'Посмотреть меню 🍽️') {
        await startOrderingProcess(bot, chatId);
        return;
    }
    if (text === 'Забронировать стол 📅') {
        startBookingProcess(bot, chatId);
        return;
    }
    if (text === 'Посмотреть корзину 🛒') {
        viewCart(bot, chatId);
        return;
    }
    if (text === 'Главное меню ↩️') {
        (0, exports.handleStartCommand)(bot, msg);
        return;
    }
    // Handle booking flow
    if (state.flow === 'BOOKING' && state.bookingStep) {
        const currentStep = state.bookingStep;
        const nextStepMap = {
            guests: 'date',
            date: 'time',
            time: 'name',
            name: 'phone',
            phone: 'CONFIRMED',
            CONFIRMED: null,
        };
        const newBookingDetails = { ...state.bookingDetails, [currentStep]: text };
        const nextStep = nextStepMap[currentStep];
        (0, state_1.updateUserState)(chatId, { bookingDetails: newBookingDetails, bookingStep: nextStep });
        switch (nextStep) {
            case 'date':
                bot.sendMessage(chatId, 'На какую дату? (например, 25.12.2024)');
                break;
            case 'time':
                bot.sendMessage(chatId, 'На какое время? (например, 19:00)');
                break;
            case 'name':
                bot.sendMessage(chatId, 'На чье имя бронируем?');
                break;
            case 'phone':
                bot.sendMessage(chatId, 'Ваш контактный телефон для связи?');
                break;
            case 'CONFIRMED':
                bot.sendMessage(chatId, 'Спасибо! Подтверждаю вашу бронь...');
                const confirmation = await (0, gemini_1.getBookingConfirmation)(newBookingDetails);
                await bot.sendMessage(chatId, confirmation);
                sendMainMenu(bot, chatId, 'Чем еще могу помочь?');
                (0, state_1.resetUserState)(chatId);
                break;
        }
        return;
    }
    // Default to Gemini for intent detection
    bot.sendChatAction(chatId, 'typing');
    const intentData = await (0, gemini_1.getBotIntent)(chatId, text);
    switch (intentData.intent) {
        case 'BOOKING':
            startBookingProcess(bot, chatId);
            break;
        case 'ORDERING':
            await startOrderingProcess(bot, chatId);
            break;
        case 'VIEW_CART':
            viewCart(bot, chatId);
            break;
        case 'GREETING':
        case 'UNCLEAR':
        case 'ERROR':
            sendMainMenu(bot, chatId, intentData.response);
            break;
        default:
            sendMainMenu(bot, chatId, 'Извините, я вас не понял. Выберите опцию из меню.');
            break;
    }
};
exports.handleTextMessage = handleTextMessage;
const handleCallbackQuery = async (bot, query) => {
    const chatId = query.message.chat.id;
    const data = query.data || '';
    if (data.startsWith('cart_add_')) {
        const itemId = data.replace('cart_add_', '');
        const item = constants_1.MENU_ITEMS.find(i => i.id === itemId);
        if (item) {
            const state = (0, state_1.getUserState)(chatId);
            const existingItem = state.cart.find(ci => ci.id === itemId);
            let newCart;
            if (existingItem) {
                newCart = state.cart.map(ci => ci.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci);
            }
            else {
                newCart = [...state.cart, { ...item, quantity: 1 }];
            }
            (0, state_1.updateUserState)(chatId, { cart: newCart });
            bot.answerCallbackQuery(query.id, { text: `"${item.name}" добавлен в корзину!` });
        }
    }
    if (data === 'cart_confirm') {
        const state = (0, state_1.getUserState)(chatId);
        if (state.cart.length > 0) {
            bot.answerCallbackQuery(query.id);
            bot.editMessageText('Спасибо! Подтверждаю ваш заказ...', { chat_id: chatId, message_id: query.message.message_id });
            const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const confirmation = await (0, gemini_1.getOrderConfirmation)(state.cart, total);
            await bot.sendMessage(chatId, confirmation);
            sendMainMenu(bot, chatId, 'Ваш заказ принят! Чем еще могу помочь?');
            (0, state_1.resetUserState)(chatId);
        }
        else {
            bot.answerCallbackQuery(query.id, { text: 'Ваша корзина пуста!', show_alert: true });
        }
    }
    if (data === 'cart_clear') {
        (0, state_1.updateUserState)(chatId, { cart: [] });
        bot.answerCallbackQuery(query.id, { text: 'Корзина очищена' });
        bot.editMessageText('Корзина пуста.', { chat_id: chatId, message_id: query.message.message_id });
        await startOrderingProcess(bot, chatId);
    }
    if (data === 'continue_ordering') {
        bot.answerCallbackQuery(query.id);
        bot.deleteMessage(chatId, query.message.message_id);
        await startOrderingProcess(bot, chatId);
    }
};
exports.handleCallbackQuery = handleCallbackQuery;
