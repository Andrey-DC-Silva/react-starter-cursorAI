import { isAuthTestMode } from "@/lib/auth/test-mode";
import {
  authenticateTestUser,
  countTestAdmins,
  countTestUsers,
  deleteTestUser,
  findTestUserByEmail,
  findTestUserById,
  listTestUsers,
  registerTestUser,
  updateTestUser,
} from "@/lib/auth/test-users";
import { prisma } from "@/lib/prisma";

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export async function findUserByEmail(email) {
  if (isAuthTestMode()) {
    return findTestUserByEmail(email);
  }

  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id) {
  if (isAuthTestMode()) {
    return findTestUserById(id);
  }

  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

export async function authenticateUser(email, password) {
  if (isAuthTestMode()) {
    return authenticateTestUser(email, password);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const { verifyPassword } = await import("@/lib/auth/password");
  const isValid = await verifyPassword(password, user.password);
  return isValid ? stripPassword(user) : null;
}

export async function createUser({ email, password, name, role = "USER" }) {
  if (isAuthTestMode()) {
    const result = registerTestUser({ email, password, name, role });
    if (result.error === "EMAIL_EXISTS") {
      return result;
    }
    return { user: result.user };
  }

  const { hashPassword } = await import("@/lib/auth/password");
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "EMAIL_EXISTS" };
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name ?? null,
      role,
    },
    select: publicUserSelect,
  });

  return { user };
}

export async function updateUser(targetId, data, { isAdmin }) {
  const updatePayload = { ...data };
  if (!isAdmin) {
    delete updatePayload.role;
  }

  if (isAuthTestMode()) {
    const result = updateTestUser(targetId, updatePayload, { isAdmin });
    if (!result) {
      return { error: "NOT_FOUND" };
    }
    if (result.error) {
      return result;
    }
    return { user: result.user };
  }

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) {
    return { error: "NOT_FOUND" };
  }

  if (updatePayload.email && updatePayload.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: updatePayload.email },
    });
    if (emailTaken) {
      return { error: "EMAIL_EXISTS" };
    }
  }

  if (updatePayload.role && existing.role === "ADMIN" && updatePayload.role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { error: "LAST_ADMIN" };
    }
  }

  const prismaData = {};
  if (updatePayload.email) {
    prismaData.email = updatePayload.email;
  }
  if (updatePayload.name !== undefined) {
    prismaData.name = updatePayload.name;
  }
  if (updatePayload.role && isAdmin) {
    prismaData.role = updatePayload.role;
  }
  if (updatePayload.password) {
    const { hashPassword } = await import("@/lib/auth/password");
    prismaData.password = await hashPassword(updatePayload.password);
  }

  const user = await prisma.user.update({
    where: { id: targetId },
    data: prismaData,
    select: publicUserSelect,
  });

  return { user };
}

export async function deleteUser(targetId) {
  if (isAuthTestMode()) {
    return deleteTestUser(targetId);
  }

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) {
    return { error: "NOT_FOUND" };
  }

  if (existing.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { error: "LAST_ADMIN" };
    }
  }

  await prisma.user.delete({ where: { id: targetId } });
  return { success: true };
}

export async function listUsers() {
  if (isAuthTestMode()) {
    return listTestUsers();
  }

  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserStats() {
  if (isAuthTestMode()) {
    return {
      total: countTestUsers(),
      admins: countTestAdmins(),
    };
  }

  const [total, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return { total, admins };
}

function stripPassword(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
