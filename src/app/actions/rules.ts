'use server';

import { aiSafetyRuleBuilder, type AISafetyRuleBuilderInput } from '@/ai/flows/ai-safety-rule-builder';
import { z } from 'zod';

const formSchema = z.object({
  naturalLanguageRule: z.string().min(10, {
    message: 'Please describe the rule in more detail.',
  }),
  zoneName: z.string(),
  siteName: z.string(),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: any;
};

export async function generateRuleFromAI(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: 'Invalid form data',
      issues,
      fields: Object.fromEntries(formData.entries()),
    };
  }

  try {
    const input: AISafetyRuleBuilderInput = validatedFields.data;
    const result = await aiSafetyRuleBuilder(input);
    return {
        message: 'Rule generated successfully.',
        data: result,
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to generate rule. An unexpected error occurred.',
    };
  }
}
