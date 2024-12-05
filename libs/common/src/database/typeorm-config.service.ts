import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const pathToMySqlDbLib = join(process.cwd(), 'libs', 'database', 'src', 'mysql')

    // TODO: check this (entities)
    return {
      type: 'mysql',
      host: this.configService.get('MYSQL_HOST'),
      port: +this.configService.get('MYSQL_PORT'),
      username: this.configService.get('MYSQL_USER'),
      password: `${this.configService.get('MYSQL_PASSWORD')}`,
      database: this.configService.get('MYSQL_DATABASE'),
      entities: [join(pathToMySqlDbLib, 'entities', '*.entity{.ts,.js}')],
      logging: this.configService.get('MYSQL_LOGGING') === 'true',
      synchronize: this.configService.get('MYSQL_SYNCHRONIZE') === 'true',
      dropSchema: this.configService.get('MYSQL_DROP_SCHEMA') === 'true'
    }
  }
}
