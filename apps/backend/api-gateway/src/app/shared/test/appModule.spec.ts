import { AppModule as GatewayAppModule } from '../../app.module';
import { NotificationModule as GatewayNotificationModule } from '../../notification/notification.module';
import { ProjectModule as GatewayProjectModule } from '../../project/project.module';

// Every feature module has to be reachable from a service root or its routes
// and NATS handlers are never bound.
describe('module registration', () => {
  const imports = (module: object): unknown[] =>
    Reflect.getMetadata('imports', module) ?? [];

  it('registers the gateway project and notification modules', () => {
    expect(imports(GatewayAppModule)).toContain(GatewayProjectModule);
    expect(imports(GatewayAppModule)).toContain(GatewayNotificationModule);
  });
});
