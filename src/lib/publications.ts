import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import {
  filterPublications,
  normalizePublicationRecord,
} from "@/lib/publication-validation";
import type { PublicationRecord, PublicationUpdate } from "@/types/publication";

const COLLECTION = "publications";

function deserialize(documentId: string, data: unknown): PublicationRecord {
  return normalizePublicationRecord(documentId, data);
}

export async function getPublications(): Promise<PublicationRecord[]> {
  const snapshot = await getFirebaseAdminDb()
    .collection(COLLECTION)
    .where("visibility", "==", "public")
    .get();
  return filterPublications(snapshot.docs.map((document) => deserialize(document.id, document.data())))
    .sort((left, right) => right.publicationDate.localeCompare(left.publicationDate));
}

export async function getPublicationBySlug(slug: string): Promise<PublicationRecord | null> {
  const snapshot = await getFirebaseAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .where("visibility", "==", "public")
    .limit(1)
    .get();
  const document = snapshot.docs[0];
  return document ? deserialize(document.id, document.data()) : null;
}

export async function getPublicationById(id: string): Promise<PublicationRecord | null> {
  const document = await getFirebaseAdminDb().collection(COLLECTION).doc(id).get();
  return document.exists ? deserialize(document.id, document.data()) : null;
}

export async function getAllPublicationsForAdmin(): Promise<PublicationRecord[]> {
  const snapshot = await getFirebaseAdminDb().collection(COLLECTION).get();
  return snapshot.docs
    .map((document) => deserialize(document.id, document.data()))
    .sort((left, right) => right.updatedAt.valueOf() - left.updatedAt.valueOf());
}

export async function createPublication(record: PublicationRecord): Promise<void> {
  const validated = normalizePublicationRecord(record.id, record);
  const reference = getFirebaseAdminDb().collection(COLLECTION).doc(validated.id);
  await getFirebaseAdminDb().runTransaction(async (transaction) => {
    if ((await transaction.get(reference)).exists) {
      throw new Error(`Publication ${validated.id} already exists.`);
    }
    transaction.create(reference, validated);
  });
}

export async function updatePublication(
  id: string,
  update: PublicationUpdate
): Promise<void> {
  const reference = getFirebaseAdminDb().collection(COLLECTION).doc(id);
  await getFirebaseAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("Publication not found.");
    const current = deserialize(snapshot.id, snapshot.data());
    const validated = normalizePublicationRecord(id, {
      ...current,
      ...update,
      updatedAt: new Date(),
    });
    transaction.set(reference, {
      ...validated,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
