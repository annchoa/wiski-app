import 'reflect-metadata'
import { DataSource } from 'typeorm'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set. Copy .env.example to .env.')
}

// Schema changes go through migrations: `synchronize` stays off.
export const dataSource = new DataSource({
	type: 'postgres',
	url: databaseUrl,
	entities: ['src/entities/*.ts'],
	migrations: ['src/migrations/*.ts'],
	synchronize: false,
})
