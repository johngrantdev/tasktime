import { AppModule } from '../../app.module';
import { NotificationModule } from '../../notification/notification.module';
import { ProjectModule } from '../../project/project.module';

describe('module registration', () => {
  const imports = (module: object): unknown[] =>
    Reflect.getMetadata('imports', module) ?? [];

  it('registers the entity-service project and notification modules', () => {
    expect(imports(AppModule)).toContain(ProjectModule);
    expect(imports(AppModule)).toContain(NotificationModule);
  });
});
