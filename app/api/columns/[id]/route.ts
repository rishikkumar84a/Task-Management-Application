import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the column and verify ownership
    const column = await prisma.column.findUnique({
      where: { id: params.id },
      include: { board: true },
    });
    
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    if (column.board.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, order } = await request.json();
    
    const updatedColumn = await prisma.column.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : undefined,
        order: order !== undefined ? order : undefined,
      },
    });
    
    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error('Error updating column:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the column' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the column and verify ownership
    const column = await prisma.column.findUnique({
      where: { id: params.id },
      include: { board: true },
    });
    
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
    
    if (column.board.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete all tasks in the column
    await prisma.task.deleteMany({
      where: { columnId: params.id },
    });
    
    // Delete the column
    await prisma.column.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting column:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the column' },
      { status: 500 }
    );
  }
} 