export type Project = {
  id: string;
  orgId: string;
  name: string;
  description: string;
  isComplete: boolean;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/project`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Could not load projects (${response.status})`);
  }
  return await response.json();
};
