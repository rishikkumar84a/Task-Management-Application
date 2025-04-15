import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import DashboardHeader from '@/app/components/DashboardHeader';
import CreateBoardButton from '@/app/components/CreateBoardButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const boards = await prisma.board.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Boards</h1>
          <CreateBoardButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{board.name}</h2>
              {board.description && (
                <p className="text-gray-600 text-sm mb-4">{board.description}</p>
              )}
              <div className="text-xs text-gray-500">
                Updated {new Date(board.updatedAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
          
          {boards.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 mb-4">
                You don&apos;t have any boards yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first board to get started
              </p>
              <CreateBoardButton />
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 