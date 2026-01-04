/**
 * RBAC Core Utility
 * Handles role-based access control logic and permission validation.
 * Based on rbac_schema.json
 */

export const RBAC_CONFIG = {
    roles: {
        admin: {
            name: "Administrator",
            inherits: ["moderator", "teacher"],
            permissions: ["*"]
        },
        moderator: {
            name: "Moderator",
            inherits: [],
            permissions: [
                "moderation.view_queue",
                "moderation.manage_content",
                "moderation.suspend_user",
                "moderation.view_logs",
                "users.view",
                "faculty.edit"
            ]
        },
        teacher: {
            name: "Teacher",
            inherits: ["student"],
            permissions: [
                "courses.view",
                "courses.manage",
                "content.create",
                "content.delete",
                "submissions.grade",
                "analytics.view_class",
                "users.view",
                "faculty.rate"
            ]
        },
        student: {
            name: "Student",
            inherits: [],
            permissions: [
                "courses.view",
                "submissions.create",
                "analytics.view_personal",
                "users.view",
                "profile.edit",
                "faculty.rate"
            ]
        }
    }
};

/**
 * Checks if a user has a specific permission based on their role(s).
 * @param {string|string[]} userRoles - Single role or array of roles assigned to the user.
 * @param {string} requiredPermission - The permission key to check (e.g., 'users.manage').
 * @returns {boolean} - True if allowed, false otherwise.
 */
export function hasPermission(userRoles, requiredPermission) {
    if (!userRoles) return false;

    // Normalize userRoles to an array
    const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
    const normalizedRoles = roles.map(r => r.toLowerCase());

    for (const roleId of normalizedRoles) {
        if (checkRolePermission(roleId, requiredPermission)) {
            return true;
        }
    }
    return false;
}

/**
 * Internal recursive helper to check permissions for a role and its ancestors.
 */
function checkRolePermission(roleId, permission) {
    const roleConfig = RBAC_CONFIG.roles[roleId];
    if (!roleConfig) return false;

    // 1. Check direct permissions
    if (roleConfig.permissions.includes('*') || roleConfig.permissions.includes(permission)) {
        return true;
    }

    // 2. Check wildcard namespaces (e.g., 'moderation.*' matches 'moderation.view_queue')
    const namespace = permission.split('.')[0];
    if (roleConfig.permissions.includes(`${namespace}.*`)) {
        return true;
    }

    // 3. Check inherited roles
    if (roleConfig.inherits && roleConfig.inherits.length > 0) {
        for (const parentRole of roleConfig.inherits) {
            if (checkRolePermission(parentRole, permission)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Get all permissions structure for UI generation
 */
export function getAllPermissions() {
    return {
        users: ["users.view", "users.manage", "users.assign_role"],
        content: ["content.view", "content.create", "content.delete", "courses.view", "courses.manage", "submissions.create", "submissions.grade"],
        moderation: ["moderation.view_queue", "moderation.manage_content", "moderation.suspend_user", "moderation.view_logs"],
        faculty: ["faculty.edit", "faculty.rate"],
        system: ["system.configure", "system.view_logs", "analytics.view_global", "analytics.view_class", "analytics.view_personal"]
    };
}
