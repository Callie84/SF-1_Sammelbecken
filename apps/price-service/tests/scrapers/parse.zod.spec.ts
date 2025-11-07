import { test, expect } from "vitest";
import { z } from 'zod';


const ProductSchema = z.object({
name: z.string().min(2).max(160),
breeder: z.string().min(1).max(80),
price: z.number().positive(),
currency: z.string().length(3),
url: z.string().url(),
inStock: z.boolean(),
packSize: z.number().int().positive().max(50).optional(),
confidence: z.number().min(0).max(1)
});


test('schema validates sample', () => {
const sample = { name: 'AKÃ¢â‚¬â€˜47', breeder: 'Serious Seeds', price: 29.9, currency: 'EUR', url: 'https://x/y', inStock: true, confidence: 0.9 };
expect(() => ProductSchema.parse(sample)).not.toThrow();
});