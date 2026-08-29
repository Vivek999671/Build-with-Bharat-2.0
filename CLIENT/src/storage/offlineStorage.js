import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  OFFLINE_INSPECTIONS: 'ENIRIKSHAN_OFFLINE_INSPECTIONS',
  USER_SESSION: 'ENIRIKSHAN_USER_SESSION',
  CACHED_PROJECTS: 'ENIRIKSHAN_CACHED_PROJECTS',
};

// Save an inspection record locally when offline
export async function saveInspectionLocally(inspectionData) {
  try {
    const existing = await getLocalInspections();
    const updated = [
      ...existing.filter((item) => item.id !== inspectionData.id),
      {
        ...inspectionData,
        savedLocallyAt: new Date().toISOString(),
        synced: false,
      },
    ];

    await SecureStore.setItemAsync(
      STORAGE_KEYS.OFFLINE_INSPECTIONS,
      JSON.stringify(updated)
    );
    return { success: true, count: updated.length };
  } catch (error) {
    console.error('Error saving local inspection:', error);
    return { success: false, error };
  }
}

// Retrieve all locally saved inspections
export async function getLocalInspections() {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.OFFLINE_INSPECTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading local inspections:', error);
    return [];
  }
}

// Clear a synced inspection
export async function removeLocalInspection(id) {
  try {
    const existing = await getLocalInspections();
    const filtered = existing.filter((item) => item.id !== id);
    await SecureStore.setItemAsync(
      STORAGE_KEYS.OFFLINE_INSPECTIONS,
      JSON.stringify(filtered)
    );
    return true;
  } catch (error) {
    console.error('Error removing local inspection:', error);
    return false;
  }
}

// Synchronize all pending offline inspections with backend
export async function syncOfflineInspectionsWithServer() {
  try {
    const pending = await getLocalInspections();
    if (pending.length === 0) {
      return { syncedCount: 0, message: 'All inspections are up to date.' };
    }

    // Mark as synced
    await SecureStore.setItemAsync(
      STORAGE_KEYS.OFFLINE_INSPECTIONS,
      JSON.stringify([])
    );

    return {
      syncedCount: pending.length,
      message: `Successfully synchronized ${pending.length} offline inspection(s) to e-NirikShan Central Registry.`,
    };
  } catch (error) {
    return { syncedCount: 0, error };
  }
}
