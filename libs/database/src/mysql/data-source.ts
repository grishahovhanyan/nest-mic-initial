import 'dotenv/config'
import { DataSource } from 'typeorm'
import { MYSQL_CONFIGS } from './config'

export default new DataSource(MYSQL_CONFIGS)
