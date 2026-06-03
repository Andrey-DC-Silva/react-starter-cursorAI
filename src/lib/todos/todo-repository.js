import { isAuthTestMode } from "@/lib/auth/test-mode";
import { prisma } from "@/lib/prisma";
import {
  createTestTodo,
  deleteTestTodo,
  findTestTodo,
  listTestTodos,
  updateTestTodo,
} from "@/lib/todos/test-todos";

const todoSelect = {
  id: true,
  title: true,
  completed: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

export async function listTodosByUserId(userId) {
  if (isAuthTestMode()) {
    return listTestTodos(userId);
  }

  return prisma.todo.findMany({
    where: { userId },
    select: todoSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function createTodo(userId, title) {
  if (isAuthTestMode()) {
    return createTestTodo(userId, title);
  }

  return prisma.todo.create({
    data: { userId, title },
    select: todoSelect,
  });
}

export async function updateTodo(userId, todoId, data) {
  if (isAuthTestMode()) {
    return updateTestTodo(userId, todoId, data);
  }

  const existing = await prisma.todo.findFirst({
    where: { id: todoId, userId },
  });

  if (!existing) {
    return null;
  }

  return prisma.todo.update({
    where: { id: todoId },
    data: {
      ...(typeof data.title === "string" ? { title: data.title } : {}),
      ...(typeof data.completed === "boolean"
        ? { completed: data.completed }
        : {}),
    },
    select: todoSelect,
  });
}

export async function deleteTodo(userId, todoId) {
  if (isAuthTestMode()) {
    return deleteTestTodo(userId, todoId);
  }

  const result = await prisma.todo.deleteMany({
    where: { id: todoId, userId },
  });

  return result.count > 0;
}

export async function findTodoById(userId, todoId) {
  if (isAuthTestMode()) {
    return findTestTodo(userId, todoId);
  }

  return prisma.todo.findFirst({
    where: { id: todoId, userId },
    select: todoSelect,
  });
}
