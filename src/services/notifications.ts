/**
 * Notifications data layer. There is no notifications backend yet, so
 * `getNotifications()` returns an empty list and the UI shows an empty state.
 * Wire this to the real endpoint (and push via expo-notifications) later.
 */
export interface AppNotification {
  id: string;
  icon: string;
  tone: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  group: string;
}

export async function getNotifications(): Promise<AppNotification[]> {
  // TODO: fetch from backend. No backend yet → empty.
  return [];
}
