import { render, screen } from '@testing-library/react';
import App from './App';

// The app boots by asking the gateway whether the session is authenticated;
// stub that so the router settles without a backend.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ json: async () => ({ auth: false }) }),
  );
});

describe('<App />', () => {
  it('renders the public home route', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', {
        name: /a tool to capture the state of a project/i,
      }),
    ).toBeInTheDocument();
  });
});
