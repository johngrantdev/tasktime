import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail.service';
import { MailerService } from '../mailer.service';

describe('MailService', () => {
  it('mails the login link to the address that asked for it', async () => {
    const mailerService = {
      sendMail: vi.fn().mockResolvedValue(undefined),
    } as unknown as MailerService;
    const configService = {
      get: vi.fn((key: string) =>
        key === 'APP_NAME' ? 'Tasktime' : 'http://localhost:3301',
      ),
    } as unknown as ConfigService;

    const service = new MailService(mailerService, configService);
    const sent = await service.sendLoginLink({
      email: 'someone@example.test',
      url: 'http://localhost:5173/?token=abc',
    });

    expect(sent).toBe(true);
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'someone@example.test',
        subject: 'Login to Tasktime',
        template: 'confirmation',
        context: expect.objectContaining({
          url: 'http://localhost:5173/?token=abc',
          appName: 'Tasktime',
        }),
      }),
    );
  });
});
