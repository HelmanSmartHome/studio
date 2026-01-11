import type { Site, Zone, Camera, SafetyRule, SafetyEvent, CorrectiveAction } from './types';

export const sites: Site[] = [
  { id: 'site-1', name: 'Main Warehouse', organizationId: 'org-1' },
  { id: 'site-2', name: 'Distribution Center', organizationId: 'org-1' },
];

export const zones: Zone[] = [
  { id: 'zone-1', name: 'Loading Dock A', siteId: 'site-1', zoneType: 'Loading', riskLevel: 'High' },
  { id: 'zone-2', name: 'Bulk Storage 1', siteId: 'site-1', zoneType: 'Storage', riskLevel: 'Medium' },
  { id: 'zone-3', name: 'Outbound Staging', siteId: 'site-2', zoneType: 'Staging', riskLevel: 'Medium' },
  { id: 'zone-4', name: 'Production Line 3', siteId: 'site-2', zoneType: 'Production', riskLevel: 'High' },
];

export const cameras: Camera[] = [
  { id: 'cam-1', name: 'Dock A-1', siteId: 'site-1', zoneId: 'zone-1', ingestionMode: 'SIMULATED', preferredStreamProfile: 'SUB', status: 'active' },
  { id: 'cam-2', name: 'Dock A-2', siteId: 'site-1', zoneId: 'zone-1', ingestionMode: 'SIMULATED', preferredStreamProfile: 'SUB', status: 'active' },
  { id: 'cam-3', name: 'Storage 1 Overhead', siteId: 'site-1', zoneId: 'zone-2', ingestionMode: 'DIRECT_RTSP', streamUrl: 'rtsp://...', status: 'inactive' },
  { id: 'cam-4', name: 'Prod Line 3 Entry', siteId: 'site-2', zoneId: 'zone-4', ingestionMode: 'SIMULATED', preferredStreamProfile: 'SUB', status: 'error', lastErrorMessage: 'Connection timeout' },
];

export const rules: SafetyRule[] = [
  { id: 'rule-1', name: 'Hard Hat Compliance', ruleType: 'PPE compliance', appliesToZoneIds: ['zone-2', 'zone-4'], severity: 'High', thresholds: { confidenceMin: 0.8 }, notificationTargets: ['EHS Manager'], enabled: true },
  { id: 'rule-2', name: 'Pedestrian-Forklift Proximity', ruleType: 'Pedestrian-forklift proximity', appliesToZoneIds: ['zone-1'], severity: 'Critical', thresholds: { distanceMeters: 3, durationSeconds: 5 }, notificationTargets: ['Supervisor', 'EHS Manager'], escalation: '10 minutes to site supervisor', enabled: true },
  { id: 'rule-3', name: 'Blocked Egress Door', ruleType: 'Blocked egress', appliesToZoneIds: ['zone-1', 'zone-3'], severity: 'High', thresholds: { durationSeconds: 60 }, notificationTargets: ['EHS Manager'], enabled: false },
  { id: 'rule-4', name: 'Restricted Zone Entry', ruleType: 'Person in restricted zone', appliesToZoneIds: ['zone-4'], severity: 'Medium', thresholds: { durationSeconds: 10 }, notificationTargets: ['Supervisor'], enabled: true },
];

const now = new Date('2024-07-26T10:00:00Z');
export const events: SafetyEvent[] = [
  { id: 'evt-1', orgId: 'org-1', siteId: 'site-1', zoneId: 'zone-1', cameraId: 'cam-1', ruleId: 'rule-2', ruleType: 'Pedestrian-forklift proximity', severity: 'Critical', timestampStart: new Date(now.getTime() - 1000 * 60 * 2).toISOString(), timestampEnd: new Date(now.getTime() - 1000 * 60 * 2 + 1000 * 7).toISOString(), durationSeconds: 7, confidence: 0.95, modelVersion: 'yolo-v8s-2.1', status: 'new', createdAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(), media: { thumbnailPath: "https://picsum.photos/seed/warehouse1/600/400", clipPath: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" } },
  { id: 'evt-2', orgId: 'org-1', siteId: 'site-1', zoneId: 'zone-2', cameraId: 'cam-3', ruleId: 'rule-1', ruleType: 'PPE compliance', severity: 'High', timestampStart: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), timestampEnd: new Date(now.getTime() - 1000 * 60 * 5 + 1000 * 1).toISOString(), durationSeconds: 1, confidence: 0.88, modelVersion: 'yolo-v8s-2.1', status: 'acknowledged', createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 4).toISOString(), media: { thumbnailPath: "https://picsum.photos/seed/hardhat1/600/400", clipPath: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" } },
  { id: 'evt-3', orgId: 'org-1', siteId: 'site-2', zoneId: 'zone-4', cameraId: 'cam-4', ruleId: 'rule-4', ruleType: 'Person in restricted zone', severity: 'Medium', timestampStart: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), timestampEnd: new Date(now.getTime() - 1000 * 60 * 15 + 1000 * 12).toISOString(), durationSeconds: 12, confidence: 0.91, modelVersion: 'yolo-v8s-2.1', status: 'actioned', createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), media: { thumbnailPath: "https://picsum.photos/seed/forklift2/600/400", clipPath: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" } },
  { id: 'evt-4', orgId: 'org-1', siteId: 'site-1', zoneId: 'zone-1', cameraId: 'cam-2', ruleId: 'rule-2', ruleType: 'Pedestrian-forklift proximity', severity: 'Critical', timestampStart: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), timestampEnd: new Date(now.getTime() - 1000 * 60 * 30 + 1000 * 6).toISOString(), durationSeconds: 6, confidence: 0.98, modelVersion: 'yolo-v8s-2.1', status: 'closed', createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 20).toISOString(), media: { thumbnailPath: "https://picsum.photos/seed/warehouse2/600/400", clipPath: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" } },
];

export const actions: CorrectiveAction[] = [
    { id: 'act-1', eventIds: ['evt-3', 'evt-4'], status: 'Assigned', owner: 'j.doe@example.com', dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(), priority: 'Medium', category: 'Training', notes: 'Review safe zone entry procedures with night shift.', createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString() },
    { id: 'act-2', eventIds: ['evt-2'], status: 'Open', owner: 's.smith@example.com', dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(), priority: 'Low', category: 'Equipment', notes: 'Check Hard Hat dispenser stock.', createdAt: new Date(now.getTime() - 1000 * 60 * 4).toISOString(), updatedAt: new Date(now.getTime() - 1000 * 60 * 4).toISOString() },
];
