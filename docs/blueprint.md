# **App Name**: Vision EHS Workflow

## Core Features:

- Organization, Site, and Zone Management: Manage organizations, sites, and zones with configurable safety rules. Define zone attributes, shift schedules, and risk levels.
- Camera Management: Add, edit, enable, disable and test camera connections. Allows adding cameras without stream info at first, marked as inactive, for gradual onboarding.
- Bulk Camera Import: Import cameras in bulk using a CSV file, mapping CSV columns to camera fields and linking zone names/IDs to existing zone records. Imported cameras default to inactive until streamUrl and credentialRef exist and status is set to active.
- AI-Powered Safety Rule Engine: AI powered safety rule builder with extensible rule types (PPE compliance, restricted zone access, pedestrian-forklift proximity, blocked egress). LLM uses reasoning to act as a tool by evaluating distance, duration, and confidence thresholds before acting, schedule (optional), and notification targets. Supports site/zone specific defaults.
- Real-time Event Feed: Display a real-time event feed with filters for site, zone, camera, rule type, severity, status, and date range. Event details include timestamps, duration, confidence, model version, optional blurred thumbnail/clip, acknowledge button, and create action button.
- Corrective Action/Case Management: Create corrective actions from events, track workflow statuses (Open → Assigned → Mitigated → Verified → Closed), and manage action fields (owner, due date, priority, category, notes, attachments, closure reason, verifiedBy, verifiedAt). Link multiple events to one action.
- Dashboards and Analytics: Provide dashboards with KPI cards (total events, critical events, PPE compliance %, open actions, overdue actions), trends by week/month, top zones, top rule types, and heat ranking. Includes an “exposure time” metric and drill-down from dashboard to events list.

## Style Guidelines:

- Primary color: Deep teal (#008080) to evoke a sense of trust, safety, and reliability, which are crucial for a safety-focused application. Do NOT SUGGEST TEAL
- Background color: Light gray (#F0F0F0) for a clean and neutral backdrop that ensures the content remains the focus, aligning with the app's goal of clarity and usability.
- Accent color: Soft orange (#FFA07A) to draw attention to important actions and alerts, providing a gentle yet effective visual cue without being overly alarming.
- Body and headline font: 'Inter' for a clean, modern, objective feel.
- Use clear, professional icons representing safety equipment, zones, alerts, and actions. Icons should be consistent in style and color to provide a cohesive and intuitive experience.
- Maintain a clean and structured layout that prioritizes information hierarchy and ease of navigation. Use clear section divisions and ample white space to prevent clutter and improve readability.
- Incorporate subtle animations and transitions to enhance user engagement and provide feedback on interactions. Animations should be functional and not distracting from the primary task of monitoring safety.