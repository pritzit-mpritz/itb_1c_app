/**
 * @fileoverview Service layer for category-related database operations.
 * @module src/services/categoryService
 */
import { db } from "../db";
import { Knex } from "knex";

const TABLE_NAME = 'category';

// Define an interface for the Category object
interface Category {
    category_id: number;
    name: string;
    last_update: string; // Consider Date type
}

/**
 * Retrieves all categories from the database.
 * @async
 * @returns {Promise<Category[]>} A promise resolving to an array of all category objects.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getAllCategories(): Promise<Category[]> {
    const connection: Knex = db();
    const categories: Category[] = await connection(TABLE_NAME).select('*');
    console.log(`Retrieved ${categories.length} categories.`);
    return categories;
}

/**
 * Retrieves a category by its unique ID.
 * @async
 * @param {number} categoryId - The ID of the category to retrieve.
 * @returns {Promise<Category | undefined>} A promise resolving to the category object or undefined if not found.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getCategoryById(categoryId: number): Promise<Category | undefined> {
    if (isNaN(categoryId) || categoryId <= 0) {
        console.warn(`getCategoryById called with invalid ID: ${categoryId}`);
        return undefined;
    }
    const connection: Knex = db();
    const category: Category | undefined = await connection(TABLE_NAME)
        .where('category_id', categoryId)
        .first(); // .first() is efficient for retrieving one record or undefined

    if (category) {
        console.log(`Retrieved category ID ${categoryId}: ${category.name}`);
    } else {
        console.log(`Category with ID ${categoryId} not found.`);
    }
    return category;
}