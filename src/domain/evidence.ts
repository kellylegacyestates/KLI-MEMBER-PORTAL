import type {
  EvidenceId,
  EvidenceStatus,
  ISODateTime,
  MatterId,
  TenantScopedRecord,
} from "./shared";

export type EvidenceType =
  | "DOCUMENT"
  | "COMMUNICATION"
  | "FILING"
  | "NOTICE"
  | "ORDER"
  | "RECORD"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "DATA"
  | "OTHER";

export interface Evidence extends TenantScopedRecord {
  id: EvidenceId;
  matterId: MatterId;
  title: string;
  evidenceType: EvidenceType;
  status: EvidenceStatus;
  source?: string;
  storageReference?: string;
  checksum?: string;
  identifiedAt?: ISODateTime;
  requestedAt?: ISODateTime;
  receivedAt?: ISODateTime;
  authenticatedAt?: ISODateTime;
  admittedAt?: ISODateTime;
  preservedAt?: ISODateTime;
}
