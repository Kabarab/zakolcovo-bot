import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';

const store = new Store();

export async function getProfiles() {
  return store.get('profiles', []);
}

export async function saveProfile(profile) {
  const profiles = await getProfiles();
  if (profile.id) {
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
  } else {
    profile.id = uuidv4();
    profiles.push(profile);
  }
  store.set('profiles', profiles);
  return profile;
}

export async function deleteProfile(id) {
  const profiles = await getProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  store.set('profiles', filtered);
  return true;
}
