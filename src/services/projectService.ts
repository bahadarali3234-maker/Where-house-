import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Project, Category } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const PROJECTS_COLLECTION = 'projects';

export const projectService = {
  subscribeToProjects(callback: (projects: Project[]) => void) {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      callback(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
    });
  },

  async addProject(project: Omit<Project, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, PROJECTS_COLLECTION);
    }
  },

  async updateProject(id: string, updates: Partial<Project>) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${PROJECTS_COLLECTION}/${id}`);
    }
  },

  async deleteProject(id: string) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${PROJECTS_COLLECTION}/${id}`);
    }
  },

  async checkIsAdmin(uid: string, email?: string | null): Promise<boolean> {
    try {
      // 1. Check if they are in the admins collection
      const docRef = doc(db, 'admins', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) return true;

      // 2. Bootstrap check for the main user
      if (email === 'bahadarali3234@gmail.com') return true;

      return false;
    } catch (error) {
      console.error('Admin check failed', error);
      // Fallback to email check if Firestore read fails (e.g. permission denied)
      return email === 'bahadarali3234@gmail.com';
    }
  }
};
