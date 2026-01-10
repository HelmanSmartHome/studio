"use client";

import { useEffect, useState, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRuleFromAI } from "@/app/actions/rules";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Sparkles, Loader2, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SafetyRule } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const ruleSchema = z.object({
  ruleName: z.string().min(1, "Rule name is required."),
  ruleType: z.enum(['PPE compliance', 'Person in restricted zone', 'Pedestrian-forklift proximity', 'Blocked egress']),
  severity: z.enum(['Low', 'Med', 'High', 'Critical']),
  thresholds: z.string().optional(),
  notificationTargets: z.string().min(1, "Notification target is required."),
});


export function AIRuleBuilder() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [generateState, generateAction] = useActionState(generateRuleFromAI, {
    message: "",
  });

  const form = useForm<z.infer<typeof ruleSchema>>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      ruleName: "",
      notificationTargets: "",
      thresholds: "{}",
    },
  });

  useEffect(() => {
    setIsGenerating(false);
    if (generateState.message && generateState.data) {
        toast({
            title: "AI Suggestion Ready!",
            description: "The AI has generated a rule based on your description. Please review and save.",
        });
        const aiData = generateState.data;
        form.setValue("ruleName", aiData.ruleName);
        form.setValue("ruleType", aiData.ruleType);
        form.setValue("severity", aiData.severity);
        form.setValue("thresholds", aiData.thresholds);
        form.setValue("notificationTargets", aiData.notificationTargets.join(', '));
    } else if (generateState.message && !generateState.data) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: generateState.message,
        });
    }
  }, [generateState, form, toast]);

  const handleGenerate = () => {
    const naturalLanguageRule = form.getValues('ruleName'); // Using ruleName field for description temp.
    if (!naturalLanguageRule || naturalLanguageRule.length < 10) {
        form.setError("ruleName", { type: "manual", message: "Please provide a more detailed description for the AI." });
        return;
    }
    
    setIsGenerating(true);
    const formData = new FormData();
    formData.append("naturalLanguageRule", naturalLanguageRule);
    formData.append("zoneName", "Loading Dock"); // Mock data
    formData.append("siteName", "Main Warehouse"); // Mock data
    generateAction(formData);
  };

  function onSubmit(values: z.infer<typeof ruleSchema>) {
    console.log(values);
    toast({
      title: "Rule Saved!",
      description: "The new safety rule has been added successfully.",
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            New Rule
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Safety Rule</DialogTitle>
          <DialogDescription>
            Describe the rule you want to create, and let AI help you configure it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ai-description">Rule Description</Label>
                <div className="flex gap-2">
                    <Textarea
                    id="ai-description"
                    placeholder="e.g., 'Alert when a person without a hard hat is detected in the storage area for more than 10 seconds.'"
                    {...form.register('ruleName')}
                    className="flex-1"
                    />
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating} size="icon" variant="outline">
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        <span className="sr-only">Generate with AI</span>
                    </Button>
                </div>
                 {form.formState.errors.ruleName && <p className="text-sm font-medium text-destructive">{form.formState.errors.ruleName.message}</p>}
            </div>

            <hr className="my-4"/>
            <p className="text-sm font-medium text-muted-foreground">AI Suggestions</p>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="ruleType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Rule Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a rule type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="PPE compliance">PPE Compliance</SelectItem>
                                <SelectItem value="Person in restricted zone">Restricted Zone</SelectItem>
                                <SelectItem value="Pedestrian-forklift proximity">Proximity</SelectItem>
                                <SelectItem value="Blocked egress">Blocked Egress</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                )}/>
                <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Med">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                )}/>
            </div>
            
             <FormField
                control={form.control}
                name="notificationTargets"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Notification Targets</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., EHS Manager, supervisor@acme.com" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list of roles or emails.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
