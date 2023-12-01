import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 8886,
  username: 'root',
  password: 'password',
  database: 'real-world-api',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;
