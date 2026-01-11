"use client";

import { useState, useRef, ChangeEvent, useActionState, useEffect } from "react";
import { Loader2, Upload, Wand2, PlusCircle, AlertTriangle, Bone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { analyzeVideoAction } from "@/app/actions/video";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { AnalyzeVideoOutput } from "@/ai/schemas/video-analysis";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const initialState: {
  message: string;
  analysis?: AnalyzeVideoOutput;
  issues?: string[];
} = {
  message: "",
};


export default function VideoAnalysisPage() {
  const [state, formAction] = useActionState(analyzeVideoAction, initialState);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [blurFaces, setBlurFaces] = useState(false);
  const [allowTraining, setAllowTraining] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a video smaller than 10MB.",
        });
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormAction = (formData: FormData) => {
    if (!videoSrc) {
        toast({
            variant: "destructive",
            title: "No Video Selected",
            description: "Please select a video file to analyze.",
        });
        return;
    }
    setIsAnalyzing(true);
    formData.set("videoDataUri", videoSrc);
    formData.set("blurFaces", String(blurFaces));
    formData.set("allowTraining", String(allowTraining));
    formAction(formData);
  }

  useEffect(() => {
    if (state.message) {
      setIsAnalyzing(false);
      if (state.analysis) {
        toast({
          title: "Analysis Complete",
          description: "The video has been successfully analyzed.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

    const getRiskBadgeClass = (riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical') => {
        switch (riskLevel) {
            case 'Critical': return 'bg-destructive/80 text-destructive-foreground';
            case 'High': return 'bg-orange-500/80 text-secondary-foreground';
            case 'Medium': return 'bg-yellow-500/80 text-secondary-foreground';
            case 'Low':
            default: return 'bg-sky-500/80 text-secondary-foreground';
        }
    };
    
    const getPriorityBadgeClass = (priority: 'Low' | 'Medium' | 'High') => {
        switch (priority) {
            case 'High': return 'text-destructive';
            case 'Medium': return 'text-orange-400';
            case 'Low': return 'text-sky-400';
            default: return 'text-muted-foreground';
        }
    }


  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Video Risk Assessment
        </h1>
      </div>
      <form action={handleFormAction} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Select a video file to be analyzed for safety risks. (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="video-file">Video File</Label>
                <div className="relative">
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="pl-14"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              {videoSrc && (
                <div className="aspect-video">
                  <video src={videoSrc} controls className="w-full h-full rounded-md" />
                </div>
              )}
               <div className="grid gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="blur-faces" checked={blurFaces} onCheckedChange={setBlurFaces} />
                  <Label htmlFor="blur-faces">Blur Faces</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="allow-training" checked={allowTraining} onCheckedChange={setAllowTraining} />
                  <Label htmlFor="allow-training">Allow video to be used for training</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isAnalyzing || !videoSrc}>
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Analyze Video
            </Button>
          </CardFooter>
        </Card>
        <div className="lg:col-span-3 space-y-4">
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>AI Risk Assessment</CardTitle>
                    {state.analysis?.riskLevel && (
                        <Badge className={cn("text-sm", getRiskBadgeClass(state.analysis.riskLevel))}>
                           <AlertTriangle className="mr-2 h-4 w-4" /> {state.analysis.riskLevel}
                        </Badge>
                    )}
                </div>
                <CardDescription>
                The AI-generated analysis of the video will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">Analyzing video, please wait...</p>
                    </div>
                ) : (
                    <Textarea
                        readOnly
                        value={state.analysis?.analysis || "Analysis will be displayed here."}
                        className="h-48 resize-none"
                        />
                )}
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bone className="h-5 w-5" />
                        <CardTitle>Ergonomic Assessment</CardTitle>
                    </div>
                    <CardDescription>
                        AI-powered ergonomic analysis using "X-Ray" vision.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     {isAnalyzing ? (
                         <div className="text-sm text-muted-foreground text-center">Assessing ergonomics...</div>
                     ) : (
                        <Textarea
                        readOnly
                        value={state.analysis?.ergonomicAssessment || "Ergonomic assessment will be displayed here."}
                        className="h-48 resize-none"
                        />
                     )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suggested Corrective Actions</CardTitle>
                    <CardDescription>
                    AI-recommended actions to mitigate identified risks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     {isAnalyzing ? (
                         <div className="text-sm text-muted-foreground text-center">Generating suggestions...</div>
                     ) : state.analysis?.suggestedActions && state.analysis.suggestedActions.length > 0 ? (
                        <div className="space-y-3">
                            {state.analysis.suggestedActions.map((action, index) => (
                                <div key={index} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{action.action}</p>
                                        <p className={cn("text-xs font-bold", getPriorityBadgeClass(action.priority))}>{action.priority} Priority</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4"/> Create Action
                                    </Button>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground text-center">No actions suggested, or analysis not yet performed.</p>
                     )}
                </CardContent>
            </Card>
        </div>
      </form>
    </div>
  );
}
