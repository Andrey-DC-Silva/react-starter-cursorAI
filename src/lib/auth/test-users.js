const now = () => new Date();

const STATIC_TEST_USERS = [
  {
    id: "test-admin",
    email: "admin@test.local",
    password: "test123",
    name: "Test Admin",
    role: "ADMIN",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "test-user",
    email: "user@test.local",
    password: "test123",
    name: "Test User",
    role: "USER",
    createdAt: now(),
    updatedAt: now(),
  },
];

/** Shown on the login page — not secret, local dev only */
export const TEST_ACCOUNTS_PUBLIC = STATIC_TEST_USERS.map((user) => ({
  email: user.email,
  password: user.password,
  role: user.role,
  label: user.role === "ADMIN" ? "Admin" : "User",
}));

const registeredUsers = [];
const deletedStaticIds = new Set();

function allTestUsersRaw() {
  return [
    ...STATIC_TEST_USERS.filter((user) => !deletedStaticIds.has(user.id)),
    ...registeredUsers,
  ];
}

function allTestUsers() {
  return allTestUsersRaw();
}

function toPublicUser(user) {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function findRawUserById(id) {
  return allTestUsersRaw().find((entry) => entry.id === id) ?? null;
}

function countAdmins() {
  return allTestUsersRaw().filter((user) => user.role === "ADMIN").length;
}

export function authenticateTestUser(email, password) {
  const user = allTestUsersRaw().find(
    (entry) => entry.email === email && entry.password === password,
  );
  return user ? toPublicUser(user) : null;
}

export function findTestUserById(id) {
  const user = findRawUserById(id);
  return user ? toPublicUser(user) : null;
}

export function findTestUserByEmail(email) {
  return allTestUsersRaw().find((entry) => entry.email === email) ?? null;
}

export function listTestUsers() {
  return allTestUsersRaw().map(toPublicUser);
}

export function countTestUsers() {
  return allTestUsersRaw().length;
}

export function countTestAdmins() {
  return countAdmins();
}

export function registerTestUser({ email, password, name, role = "USER" }) {
  const existing = findTestUserByEmail(email);
  if (existing) {
    return { error: "EMAIL_EXISTS" };
  }

  const user = {
    id: `test-${Date.now()}`,
    email,
    password,
    name: name ?? null,
    role,
    createdAt: now(),
    updatedAt: now(),
  };

  registeredUsers.push(user);
  return { user: toPublicUser(user) };
}

export function updateTestUser(id, data, { isAdmin }) {
  const user = findRawUserById(id);
  if (!user) {
    return null;
  }

  if (data.email && data.email !== user.email && findTestUserByEmail(data.email)) {
    return { error: "EMAIL_EXISTS" };
  }

  if (data.email) {
    user.email = data.email;
  }
  if (data.name !== undefined) {
    user.name = data.name;
  }
  if (data.password) {
    user.password = data.password;
  }
  if (isAdmin && data.role) {
    if (user.role === "ADMIN" && data.role !== "ADMIN" && countAdmins() <= 1) {
      return { error: "LAST_ADMIN" };
    }
    user.role = data.role;
  }

  user.updatedAt = now();
  return { user: toPublicUser(user) };
}

export function deleteTestUser(id) {
  const user = findRawUserById(id);
  if (!user) {
    return { error: "NOT_FOUND" };
  }

  if (user.role === "ADMIN" && countAdmins() <= 1) {
    return { error: "LAST_ADMIN" };
  }

  const staticUser = STATIC_TEST_USERS.find((entry) => entry.id === id);
  if (staticUser) {
    deletedStaticIds.add(id);
    return { success: true };
  }

  const index = registeredUsers.findIndex((entry) => entry.id === id);
  if (index !== -1) {
    registeredUsers.splice(index, 1);
    return { success: true };
  }

  return { error: "NOT_FOUND" };
}
