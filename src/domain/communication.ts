import type {
  CapacityId,
  CommunicationId,
  DeadlineId,
  EvidenceId,
  ISODateTime,
  MatterId,
  PartyId,
  TenantScopedRecord,
} from "./shared";

export type CommunicationType =
  | "LETTER"
  | "NOTICE"
  | "EMAIL"
  | "FILING"
  | "REQUEST"
  | "RESPONSE"
  | "SERVICE_RECORD"
  | "INTERNAL"
  | "OTHER";

export interface Communication extends TenantScopedRecord {
  id: CommunicationId;
  matterId: MatterId;
  communicationType: CommunicationType;
  senderPartyId?: PartyId;
  senderCapacityId?: CapacityId;
  recipientPartyIds?: PartyId[];
  recipientCapacityIds?: CapacityId[];
  subject?: string;
  sentAt?: ISODateTime;
  receivedAt?: ISODateTime;
  serviceMethod?: string;
  evidenceId?: EvidenceId;
  responseRequired?: boolean;
  responseDeadlineId?: DeadlineId;
}
