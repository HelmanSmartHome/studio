"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { Loader2, Upload, Wand2 } from "lucide-react";
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

const initialState = {
  message: "",
  analysis: "",
};

export default function VideoAnalysisPage() {
  const [state, formAction] = useFormState(analyzeVideoAction, initialState);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a video smaller than 4MB.",
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
    formAction(formData);
  }

  useState(() => {
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
  });


  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Video Analysis
        </h1>
      </div>
      <form action={handleFormAction} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Select a video file to be analyzed by the AI. (Max 4MB)
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
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
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
                    value={state.analysis || "Analysis will be displayed here."}
                    className="h-48 resize-none"
                    />
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
