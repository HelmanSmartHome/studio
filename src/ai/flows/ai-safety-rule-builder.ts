// src/ai/flows/ai-safety-rule-builder.ts
'use server';
/**
 * @fileOverview AI-powered safety rule builder flow.
 *
 * This file defines a Genkit flow that leverages AI to create and customize safety rules
 * based on natural language input.
 *
 * @module ai/flows/ai-safety-rule-builder
 *
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - aiSafetyRuleBuilder - A function that handles the safety rule building process.
 * - AISafetyRuleBuilderInput - The input type for the aiSafetyRuleBuilder function.
 * - AISafetyRuleBuilderOutput - The return type for the aiSafetyRuleBuilder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISafetyRuleBuilderInputSchema = z.object({
  zoneName: z.string().describe('The name of the zone for which the rule is being created.'),
  siteName: z.string().describe('The name of the site where the zone is located.'),
  naturalLanguageRule: z
    .string()
    .describe(
      'A description of the desired safety rule in natural language. Be as specific as possible, including details like thresholds (distance in meters, duration in seconds), objects (PPE compliance: hi-vis vest, hard hat, safety glasses), notification targets (roles/users), and escalation policies (if not acknowledged within X minutes).'
    ),
});
export type AISafetyRuleBuilderInput = z.infer<typeof AISafetyRuleBuilderInputSchema>;

const AISafetyRuleBuilderOutputSchema = z.object({
  ruleName: z.string().describe('A concise name for the safety rule.'),
  ruleType: z
    .string()
    .describe(
      'The type of safety rule.  MUST be chosen from the following list: PPE compliance, Person in restricted zone, Pedestrian-forklift proximity, Blocked egress. Return only the literal string, nothing else.'
    ),
  appliesToZoneIds: z
    .array(z.string())
    .describe('An array of zone IDs to which this rule applies. Should include the zone of interest.'),
  severity: z
    .string()
    .describe(
      'The severity of the rule violation. MUST be chosen from the following list: Low, Med, High, Critical. Return only the literal string, nothing else.'
    ),
  thresholds: z
    .string()
    .describe(
      'A JSON string containing the thresholds for the rule, such as distance in meters, duration in seconds, and minimum confidence level. If no thresholds are specified, return an empty JSON object {}'
    ),
  schedule: z
    .string()
    .optional()
    .describe('The schedule for the rule (optional). If not specified, omit this field.'),
  notificationTargets: z
    .array(z.string())
    .describe('An array of roles/users to notify when the rule is violated.'),
  escalation: z
    .string()
    .optional()
    .describe(
      'Escalation policy if the event is not acknowledged within X minutes (optional). If not specified, omit this field.'
    ),
});
export type AISafetyRuleBuilderOutput = z.infer<typeof AISafetyRuleBuilderOutputSchema>;

export async function aiSafetyRuleBuilder(input: AISafetyRuleBuilderInput): Promise<AISafetyRuleBuilderOutput> {
  return aiSafetyRuleBuilderFlow(input);
}

const aiSafetyRuleBuilderPrompt = ai.definePrompt({
  name: 'aiSafetyRuleBuilderPrompt',
  input: {schema: AISafetyRuleBuilderInputSchema},
  output: {schema: AISafetyRuleBuilderOutputSchema},
  prompt: `You are an AI-powered safety rule builder.  Your purpose is to translate a
user-provided natural language description of a safety rule into a structured format that can be used by a safety monitoring system.

Instructions:

1.  Understand the User's Intent: Carefully analyze the provided natural language rule description to understand the desired safety rule and its specific requirements.
2.  Extract Key Information: Identify and extract key information from the rule description, such as the type of rule, the conditions under which it should be triggered, the severity of the violation, and any relevant thresholds or schedules.
3.  Suggest Specific Values: Select MUST be chosen from a pre-defined set of options (PPE compliance, Person in restricted zone, Pedestrian-forklift proximity, Blocked egress) for ruleType and (Low, Med, High, Critical) for severity.
4.  Format Thresholds as JSON: Convert any identified thresholds (e.g., distance, duration, confidence) into a JSON string.
5.  Output Structured Rule: Output the extracted information in the specified JSON format.


Example:

Input:

zoneName: Loading Dock
siteName: Main Warehouse
naturalLanguageRule: Create a rule to detect pedestrians within 3 meters of a forklift for more than 5 seconds in the Loading Dock zone. The severity should be High, and EHS managers should be notified. Escalate to the site supervisor if not acknowledged within 10 minutes.

Output:

{
  "ruleName": "Pedestrian-Forklift Proximity (Loading Dock)",
  "ruleType": "Pedestrian-forklift proximity",
  "appliesToZoneIds": ["Loading Dock"],
  "severity": "High",
  "thresholds": '{"distanceMeters": 3, "durationSeconds": 5}',
  "notificationTargets": ["EHS Manager"],
  "escalation": "10 minutes to site supervisor"
}

Now, generate the safety rule based on the following input:

zoneName: {{{zoneName}}}
siteName: {{{siteName}}}
naturalLanguageRule: {{{naturalLanguageRule}}}`,
});

const aiSafetyRuleBuilderFlow = ai.defineFlow(
  {
    name: 'aiSafetyRuleBuilderFlow',
    inputSchema: AISafetyRuleBuilderInputSchema,
    outputSchema: AISafetyRuleBuilderOutputSchema,
  },
  async input => {
    const {output} = await aiSafetyRuleBuilderPrompt(input);
    return output!;
  }
);
