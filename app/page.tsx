import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">TaskFlow</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-ghost">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto py-24 px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Manage tasks with ease
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskFlow helps you organize your projects with a visual, 
                drag-and-drop interface. Create boards, add tasks, set 
                deadlines, and collaborate with your team.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link href="/features" className="btn btn-ghost">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="rounded-lg shadow-md overflow-hidden h-96 relative">
              <Image
                src="/taskflow_image.png"
                alt="TaskFlow Application Screenshot"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </section>
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">Kanban Boards</h3>
                <p className="text-gray-600">
                  Visualize your workflow with customizable columns and drag-and-drop tasks.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">Task Management</h3>
                <p className="text-gray-600">
                  Create detailed tasks with descriptions, deadlines, labels, and comments.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                <p className="text-gray-600">
                  Invite team members to boards and collaborate in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 