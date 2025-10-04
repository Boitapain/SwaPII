import { pgTable, integer, inet, timestamp, uuid, text } from 'drizzle-orm/pg-core';

export const profile = pgTable('profile', {
	id: uuid().primaryKey(),
	role: text('role').notNull().default('user'),
	ip_address: inet('ip_address'),
	ui_language: text('ui_language').notNull().default('en'),
	created_at: timestamp().notNull().defaultNow(),
});