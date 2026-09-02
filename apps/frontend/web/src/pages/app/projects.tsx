import { useEffect, useState } from 'react';
import { getProjects, type Project } from '@/services/getProjects';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex max-w-[980px] flex-col items-start gap-4 px-8 py-6">
      <h1 className="font-sans text-3xl leading-tight tracking-tighter">
        Projects
      </h1>
      {loading ? <p>Loading projects...</p> : null}
      {error ? <p className="text-destructive">{error}</p> : null}
      {!loading && !error && projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : null}
      <ul className="flex w-full flex-col gap-2">
        {projects.map((project) => (
          <li key={project.id} className="rounded-md border p-4">
            <span className="font-medium">{project.name}</span>
            {project.description ? (
              <p className="text-sm">{project.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
