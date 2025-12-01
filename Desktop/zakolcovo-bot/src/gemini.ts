
import { GoogleGenAI, Chat } from '@google/genai';
import { BookingDetails, CartItem } from './types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("[GEMINI] API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
const model = 'gemini-2.5-flash';

const systemInstruction = `
You are a friendly and helpful AI assistant for the 'Zakolcovo' restaurant. Your name is Zak.
Your primary functions are to help users book a table and order food.
You must speak in Russian.
When a user wants to book a table, guide them through the process by asking for: number of guests, date, time, their name, and phone number.
When a user wants to order food, present them with the menu.
Be conversational, polite, and efficient.
Analyze the user's message to understand their intent (booking, ordering, or general question).
Based on the user's message, output one of the following intents as a JSON object:
- If the user wants to book a table: {"intent": "BOOKING"}
- If the user wants to see the menu or order food: {"intent": "ORDERING"}
- If the user wants to see their current order/cart: {"intent": "VIEW_CART"}
- If the user is just greeting or asking a general question, respond conversationally: {"intent": "GREETING", "response": "Your friendly response here."}
- If the user's intent is unclear: {"intent": "UNCLEAR", "response": "Your clarifying question here."}
Do not add any other text or markdown formatting around the JSON object.
`;

const chatSessions = new Map<number, Chat>();

function getChatSession(chatId: number): Chat {
  if (!chatSessions.has(chatId)) {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    chatSessions.set(chatId, chat);
  }
  return chatSessions.get(chatId)!;
}

export async function getBotIntent(chatId: number, userMessage: string): Promise<any> {
  const chatSession = getChatSession(chatId);
  try {
    const response = await chatSession.sendMessage({ message: userMessage });
    const jsonString = (response.text || '').trim();
    
    const match = jsonString.match(/\{.*\}/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return { intent: 'GREETING', response: jsonString };

  } catch (error) {
    console.error("[GEMINI] Error getting intent:", error);
    return { intent: 'ERROR', response: 'Извините, у меня возникла небольшая проблема. Попробуйте еще раз.' };
  }
}

export async function getBookingConfirmation(details: BookingDetails): Promise<string> {
    const prompt = `
    The user has completed a table booking. Please generate a friendly confirmation message in Russian.
    Include all the details in a clear, summarized format.
    Details:
    - Guests: ${details.guests}
    - Date: ${details.date}
    - Time: ${details.time}
    - Name: ${details.name}
    - Phone: ${details.phone}
    
    Start with "Отлично, ${details.name}!" and end with "Мы будем ждать вас!".
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return response.text ?? `Отлично, ${details.name}! Ваш столик на ${details.guests} чел. забронирован на ${details.date} в ${details.time}. Мы будем ждать вас!`;
    } catch (error) {
        console.error("[GEMINI] Error generating booking confirmation:", error);
        return `Отлично, ${details.name}! Ваш столик на ${details.guests} чел. забронирован на ${details.date} в ${details.time}. Мы будем ждать вас!`;
    }
}

export async function getOrderConfirmation(cartItems: CartItem[], total: number): Promise<string> {
    const itemsList = cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const prompt = `
    The user has confirmed their order. Please generate a friendly confirmation message in Russian.
    The order total is ${total} BYN.
    The items are:
    ${itemsList}
    
    Start with "Ваш заказ принят!". Summarize the order and total cost, and give an estimated delivery/preparation time of 25-30 minutes.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return response.text ?? `Ваш заказ принят! Общая сумма: ${total} BYN. Ожидаемое время готовности: 25-30 минут. Спасибо за заказ!`;
    } catch (error) {
        console.error("[GEMINI] Error generating order confirmation:", error);
        return `Ваш заказ принят! Общая сумма: ${total} BYN. Ожидаемое время готовности: 25-30 минут. Спасибо за заказ!`;
    }
}
