import {z} from 'genkit';

/**
 * @fileOverview Schemas for the video analysis AI flow.
 *
 * - AnalyzeVideoInputSchema - The Zod schema for the video analysis input.
 * - AnalyzeVideoOutputSchema - The Zod schema for the video analysis output.
 * - AnalyzeVideoInput - The TypeScript type for the video analysis input.
 * - AnalyzeVideoOutput - The TypeScript type for the video analysis output.
 */

export const AnalyzeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  blurFaces: z.boolean().optional().describe('Whether to blur faces in the video for privacy.'),
  allowTraining: z.boolean().optional().describe('Whether the video can be used for training purposes.'),
});
export type AnalyzeVideoInput = z.infer<typeof AnalyzeVideoInputSchema>;


const SuggestedActionSchema = z.object({
    action: z.string().describe("A brief, actionable suggestion."),
    priority: z.enum(['Low', 'Medium', 'High']).describe("The priority of the suggested action."),
});

export const AnalyzeVideoOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the video content, including potential general safety hazards identified.'),
  ergonomicAssessment: z.string().describe('A detailed analysis of the ergonomic risks, commenting on posture, lifting techniques, and repetitive strain.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe("The overall risk level assessed from the video."),
  suggestedActions: z.array(SuggestedActionSchema).describe("A list of suggested corrective actions to mitigate identified risks."),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;
