'use server';

import { analyzeVideo, type AnalyzeVideoInput } from '@/ai/flows/video-analysis-flow';
import { z } from 'zod';

const formSchema = z.object({
  videoDataUri: z.string().min(1, {
    message: 'Please upload a video file.',
  }),
});

type FormState = {
  message: string;
  analysis?: string;
  issues?: string[];
};

export async function analyzeVideoAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: 'Invalid form data',
      issues,
    };
  }

  try {
    const input: AnalyzeVideoInput = validatedFields.data;
    const result = await analyzeVideo(input);
    return {
        message: 'Video analyzed successfully.',
        analysis: result.analysis,
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to analyze video. An unexpected error occurred.',
    };
  }
}
