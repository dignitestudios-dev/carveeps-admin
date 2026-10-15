export const ADMIN_MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Access main overview, statistics, and business summaries",
  },
  {
    key: "users",
    label: "Users",
    description: "View and manage registered platform customers and users",
  },
  {
    key: "dealerships",
    label: "Dealerships",
    description: "Manage approved dealerships and registration applications",
  },
  {
    key: "tickets",
    label: "Tickets",
    description: "Handle support chats and customer help tickets",
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Create and broadcast push notifications to users",
  },
  {
    key: "roles",
    label: "Roles",
    description: "Manage staff roles and access control permission templates",
  },
  {
    key: "subadmins",
    label: "Subadmins",
    description: "Create and manage sub-accounts with custom permission sets",
  },
  {
    key: "config",
    label: "Config / Commission",
    description: "Configure system commission rates and settings",
  },
];

export const MODULE_KEYS = ADMIN_MODULES.map((m) => m.key);

export const MODULE_LABELS = ADMIN_MODULES.reduce((acc, m) => {
  acc[m.key] = m.label;
  return acc;
}, {});
