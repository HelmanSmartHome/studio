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

export const AnalyzeVideoOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the video content.'),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;
