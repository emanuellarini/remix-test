import { PrismaClient } from '@prisma/client'

export type TodoType = { id: number; title: string };

const prisma = new PrismaClient();

export const postTodo = (title: string): Promise<TodoType> => prisma.todo.create({
  data: {
    title
  }
});

export const deleteTodo = async (id: number): Promise<boolean> => {
  await prisma.todo.delete({
    where: {
      id
    }
  })

  return true;
}

export const getTodos = (): Promise<TodoType[]> => prisma.todo.findMany();

export const getTodosWithA = (): Promise<TodoType[]> => prisma.todo.findMany({
  where: {
    title: {
      contains: 'a'
    }
  }
});
