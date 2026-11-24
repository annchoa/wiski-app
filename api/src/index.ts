import express from 'express'
import { dataSource } from './data-source'

await dataSource.initialize()

const app = express()

app.get('/health', (_request, response) => {
	response.json({ status: 'ok' })
})

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => {
	console.log(`API listening on port ${port}`)
})
