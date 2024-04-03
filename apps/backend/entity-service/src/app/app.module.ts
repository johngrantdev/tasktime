import { Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AbilityModule } from './ability/ability.module';
import { AbilitiesGuard } from './shared/guards/abilities.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { ItemModule } from './item/item.module';
import { OrgModule } from './org/org.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AbilityModule,
    ItemModule,
    OrgModule,
    ProjectModule,
    UserModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../../.env',
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => mikroOrmConfig(),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(/* consumer: MiddlewareConsumer */) {
    // consumer.apply(JwtMiddleware).forRoutes('*'); // Apply the jwt decrypting middleware to all routes
  }
}
