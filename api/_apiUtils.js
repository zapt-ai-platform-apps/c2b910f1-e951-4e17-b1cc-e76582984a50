import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from "@sentry/node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export function initializeDb() {
  try {
    const connectionString = process.env.COCKROACH_DB_URL;
    if (!connectionString) {
      throw new Error('Database connection string not provided');
    }
    
    const client = postgres(connectionString);
    return drizzle(client);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export async function sendWhatsAppMessage(phone, message) {
  try {
    const whatsappNumber = process.env.WHATSAPP_NUMBER;
    if (!whatsappNumber) {
      throw new Error('WhatsApp number not configured');
    }
    
    // Format the URL for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    
    return {
      success: true,
      url: whatsappUrl
    };
  } catch (error) {
    console.error('Failed to prepare WhatsApp message:', error);
    Sentry.captureException(error);
    return {
      success: false,
      error: error.message
    };
  }
}