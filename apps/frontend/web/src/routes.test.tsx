import { render, screen, waitFor } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { createMainRoutes } from './App';

// The login flow redirects to /app, and the Launch button links to
// /app/projects. Neither may fall through to the catch-all NotFound route.
const mountAt = (path: string) => {
  const routes = createRoutesFromElements(
    createMainRoutes({
      userLoggedIn: true,
      setUserLoggedIn: () => undefined,
      redirect: '',
    }),
  );
  return render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [path] })}
    />,
  );
};

describe('app routes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
    );
  });

  it('renders the projects page at /app/projects', async () => {
    mountAt('/app/projects');
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Projects' }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
  });

  it('sends /app on to the projects page', async () => {
    mountAt('/app');
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Projects' }),
      ).toBeInTheDocument(),
    );
  });

  it('still shows NotFound for an unknown path', async () => {
    mountAt('/no-such-page');
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Projects' }),
      ).not.toBeInTheDocument(),
    );
  });
});
