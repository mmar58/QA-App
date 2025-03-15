// storage.ts
import { Storage } from '@ionic/storage';

const storage = new Storage();

storage.create(); // Create the storage if it doesn't exist

export default storage;
