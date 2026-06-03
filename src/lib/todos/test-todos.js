const todosByUserId = new Map();

function now() {
  return new Date();
}

function getUserTodos(userId) {
  if (!todosByUserId.has(userId)) {
    todosByUserId.set(userId, []);
  }
  return todosByUserId.get(userId);
}

export function listTestTodos(userId) {
  return getUserTodos(userId)
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function createTestTodo(userId, title) {
  const todo = {
    id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    title,
    completed: false,
    createdAt: now(),
    updatedAt: now(),
  };

  getUserTodos(userId).push(todo);
  return todo;
}

export function findTestTodo(userId, todoId) {
  return getUserTodos(userId).find((todo) => todo.id === todoId) ?? null;
}

export function updateTestTodo(userId, todoId, data) {
  const todo = findTestTodo(userId, todoId);
  if (!todo) {
    return null;
  }

  if (typeof data.title === "string") {
    todo.title = data.title;
  }
  if (typeof data.completed === "boolean") {
    todo.completed = data.completed;
  }
  todo.updatedAt = now();

  return todo;
}

export function deleteTestTodo(userId, todoId) {
  const todos = getUserTodos(userId);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  return true;
}
