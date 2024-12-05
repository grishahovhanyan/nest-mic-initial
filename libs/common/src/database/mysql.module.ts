import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MySqlConfigService } from './typeorm-config.service'
import { addTransactionalDataSource } from 'typeorm-transactional'
import { DataSource } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MySqlConfigService,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('[MySql database connection failed]: Invalid options passed')
        }

        return addTransactionalDataSource(new DataSource(options))
      }
    })
  ]
})
export class MysqlModule {}
