import { orders } from '../drizzle/schema.js';
import { initializeDb, formatCurrency, sendWhatsAppMessage } from './_apiUtils.js';
import { eq, desc } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/orders`);

  try {
    const db = initializeDb();

    if (req.method === 'GET') {
      console.log('Fetching all orders');
      const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
      console.log(`Retrieved ${result.length} orders`);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      console.log('Creating new order');
      const { customerName, customerPhone, deliveryMethod, address, items, totalAmount } = req.body;
      
      if (!customerName || !customerPhone || !deliveryMethod || !items || !totalAmount) {
        return res.status(400).json({ 
          error: 'Customer name, phone, delivery method, items and total amount are required' 
        });
      }
      
      // Create order in database
      const itemsJson = JSON.stringify(items);
      const newOrder = await db.insert(orders).values({
        customerName,
        customerPhone,
        deliveryMethod,
        address: address || null,
        items: itemsJson,
        totalAmount,
        status: 'pending',
        whatsappSent: false,
        printed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      console.log('Order created:', newOrder[0].id);
      
      // Prepare WhatsApp message
      const parsedItems = JSON.parse(itemsJson);
      let message = `*NOVO PEDIDO #${newOrder[0].id}*\n`;
      message += `*Cliente:* ${customerName}\n`;
      message += `*Telefone:* ${customerPhone}\n`;
      message += `*Tipo:* ${deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}\n`;
      
      if (deliveryMethod === 'delivery' && address) {
        message += `*Endereço:* ${address}\n`;
      }
      
      message += `\n*ITENS DO PEDIDO:*\n`;
      parsedItems.forEach(item => {
        message += `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}\n`;
      });
      
      message += `\n*Total:* ${formatCurrency(totalAmount)}`;
      
      // Generate WhatsApp link
      const whatsappData = await sendWhatsAppMessage(null, message);
      
      return res.status(201).json({
        order: newOrder[0],
        whatsappUrl: whatsappData.success ? whatsappData.url : null
      });
    }

    if (req.method === 'PUT') {
      console.log('Updating order status');
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ error: 'Order id and status are required' });
      }
      
      const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const updatedOrder = await db.update(orders)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(orders.id, id))
        .returning();
      
      if (updatedOrder.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      console.log(`Order ${id} status updated to ${status}`);
      return res.status(200).json(updatedOrder[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in orders API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}