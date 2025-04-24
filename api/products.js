import { products, categories } from '../drizzle/schema.js';
import { initializeDb } from './_apiUtils.js';
import { eq, and, isNull } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/products`);

  try {
    const db = initializeDb();

    if (req.method === 'GET') {
      console.log('Fetching all products');
      const allProducts = await db.query.products.findMany({
        where: eq(products.isActive, true),
        with: {
          category: true
        },
        orderBy: products.name
      });
      console.log(`Retrieved ${allProducts.length} products`);
      return res.status(200).json(allProducts);
    }

    if (req.method === 'POST') {
      console.log('Creating new product');
      const { name, description, price, imageUrl, categoryId, isCombo } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
      }
      
      const newProduct = await db.insert(products).values({
        name,
        description,
        price,
        imageUrl,
        categoryId: categoryId || null,
        isCombo: isCombo || false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      console.log('Product created:', newProduct[0].id);
      return res.status(201).json(newProduct[0]);
    }

    if (req.method === 'PUT') {
      console.log('Updating product');
      const { id, name, description, price, imageUrl, categoryId, isCombo, isActive } = req.body;
      
      if (!id || !name || !price) {
        return res.status(400).json({ error: 'Id, name and price are required' });
      }
      
      const updatedProduct = await db.update(products)
        .set({
          name,
          description,
          price,
          imageUrl,
          categoryId: categoryId || null,
          isCombo: isCombo || false,
          isActive: isActive !== undefined ? isActive : true,
          updatedAt: new Date()
        })
        .where(eq(products.id, id))
        .returning();
      
      if (updatedProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log('Product updated:', id);
      return res.status(200).json(updatedProduct[0]);
    }

    if (req.method === 'DELETE') {
      console.log('Deleting product');
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Id is required' });
      }
      
      // Soft delete by setting isActive to false
      const deletedProduct = await db.update(products)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(products.id, id))
        .returning();
      
      if (deletedProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log('Product deleted (soft):', id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in products API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}