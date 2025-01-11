import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    MongooseModule.forRoot(envs.databaseUrl),
    RoleModule,  
  ],
})
export class AppModule {}
