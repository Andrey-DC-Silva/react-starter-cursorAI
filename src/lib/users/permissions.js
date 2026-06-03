export function canAccessUser(actor, targetUserId) {
  if (!actor) {
    return false;
  }
  return actor.role === "ADMIN" || actor.id === targetUserId;
}

export function assertUserAccess(actor, targetUserId) {
  if (!canAccessUser(actor, targetUserId)) {
    return { error: "FORBIDDEN", status: 403 };
  }
  return null;
}
