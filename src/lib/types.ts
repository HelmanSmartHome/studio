export type Organization = {
  id: string;
  name: string;
};

export type Site = {
  id: string;
  name:string;
  organizationId: string;
};

export type Zone = {
  id: string;
  name: string;
  siteId: string;
  zoneType: 'Loading' | 'Storage' | 'Production' | 'Staging';
  riskLevel: 'Low' | 'Medium' | 'High';
  shiftSchedule?: string;
};

export type Camera = {
  id: string;
  name: string;
  siteId: string;
  zoneId: string;
  manufacturer?: string;
  model?: string;
  ingestionMode: 'DIRECT_RTSP' | 'VMS_URL' | 'SIMULATED' | 'WEBCAM';
  streamUrl?: string;
  credentialRef?: string;
  preferredStreamProfile: 'MAIN' | 'SUB';
  status: 'inactive' | 'active' | 'error';
  lastHeartbeat?: string;
  lastFrameTimestamp?: string;
  lastErrorMessage?: string;
};

export type SafetyRule = {
  id: string;
  name: string;
  ruleType: 'PPE compliance' | 'Person in restricted zone' | 'Pedestrian-forklift proximity' | 'Blocked egress';
  appliesToZoneIds: string[];
  severity: 'Low' | 'Med' | 'High' | 'Critical';
  thresholds: {
    distanceMeters?: number;
    durationSeconds?: number;
    confidenceMin?: number;
  };
  schedule?: string;
  notificationTargets: string[];
  escalation?: string;
  enabled: boolean;
};

export type SafetyEvent = {
  id: string;
  orgId: string;
  siteId: string;
  zoneId: string;
  cameraId: string;
  ruleId: string;
  ruleType: SafetyRule['ruleType'];
  severity: SafetyRule['severity'];
  timestampStart: string;
  timestampEnd: string;
  durationSeconds: number;
  confidence: number;
  modelVersion: string;
  media?: {
    thumbnailPath?: string;
    clipPath?: string;
  };
  status: 'new' | 'acknowledged' | 'actioned' | 'closed';
  createdAt: string;
  updatedAt: string;
};

export type CorrectiveAction = {
  id: string;
  eventIds: string[];
  status: 'Open' | 'Assigned' | 'Mitigated' | 'Verified' | 'Closed';
  owner: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Process' | 'Equipment' | 'Training' | 'Other';
  notes: string;
  attachments?: string[];
  closureReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};
