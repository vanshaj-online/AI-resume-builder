import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Trash } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { resumes, fetchResumes, createResume, isLoading, deleteResume } = useResumeStore();
  const navigate = useNavigate();



  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      try {
        await deleteResume(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRole) return;

    try {
      const newId = await createResume({ title: newTitle, targetRole: newRole });

      navigate(`/builder/${newId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">

      <nav className="border-b border-surface-pressed px-8 py-4 flex justify-between items-center bg-canvas">
        <h1 className="font-display font-bold text-xl">ResumeAI</h1>
        <div className="flex items-center gap-4">
          <span className="font-body text-body text-sm">Hello, {user?.name}</span>
          <Button variant="subtle" onClick={logout}>Log Out</Button>
        </div>
      </nav>


      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl tracking-tight font-bold">Your Resumes</h2>
          <Button className='text-sm tracking-wide' variant={showCreate ? 'subtle' : 'primary'} onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancel' : 'New Resume'}
          </Button>
        </div>


        {showCreate && (
          <div className="bg-canvas-soft rounded-xl p-6 mb-8 border border-surface-pressed">
            <h3 className="font-display font-bold text-lg mb-4">Start a new resume</h3>
            <form onSubmit={handleCreate} className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Resume Title (e.g. Google Application)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Target Job Role (e.g. Frontend Developer)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" isLoading={isLoading} className="mb-1">Create</Button>
            </form>
          </div>
        )}


        {isLoading && resumes.length === 0 ? (
          <div className="text-body font-body">Loading your documents...</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 bg-canvas-soft rounded-xl border border-dashed border-mute">
            <p className="text-body font-body">You haven't created any resumes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Link key={resume._id} to={`/builder/${resume._id}`} className="bg-canvas rounded-xl p-6 border border-surface-pressed shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-48">
                <div>
                  <h3 className="font-display font-bold text-lg truncate">{resume.title}</h3>
                  <p className="font-body text-body text-sm mt-1">{resume.targetRole}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-mute font-body">
                    Updated: {new Date(resume.updatedAt!).toLocaleDateString()}
                  </span>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(resume._id!) }} className="text-red-500 text-xs font-body rounded-md p-2 bg-red-200 hover:bg-red-400 hover:text-white transition-colors">
                    <Trash size={16}/>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};