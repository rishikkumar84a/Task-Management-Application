import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardHeader from '@/app/components/DashboardHeader';
import KanbanBoard from '@/app/components/KanbanBoard';

export default async function BoardPage({ params }: { params: { id: string } }) {
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

  const board = await prisma.board.findUnique({
    where: {
      id: params.id,
    },
    include: {
      columns: {
        orderBy: {
          order: 'asc',
        },
        include: {
          tasks: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              labels: true,
            },
          },
        },
      },
    },
  });

  if (!board) {
    notFound();
  }

  // Check if user has access to this board
  if (board.userId !== user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            {board.description && (
              <p className="mt-1 text-gray-600">{board.description}</p>
            )}
          </div>
          
          <KanbanBoard board={board} />
        </div>
      </main>
    </div>
  );
} 