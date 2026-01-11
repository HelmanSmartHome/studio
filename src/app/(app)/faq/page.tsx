import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaqPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Frequently Asked Questions</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Camera & Integration</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>How do I connect my Wyze camera?</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 pt-2">
                        <p>While direct Wyze app integration is not supported, you can connect most Wyze cameras by enabling their RTSP (Real-Time Streaming Protocol) feature. This provides a direct video stream URL that you can add to this application.</p>
                        
                        <h4 className="font-semibold pt-2">Step 1: Enable RTSP in the Wyze App</h4>
                        <ol className="list-decimal list-inside space-y-2 pl-4 text-muted-foreground">
                            <li>Open the Wyze app on your phone.</li>
                            <li>Select the camera you want to connect.</li>
                            <li>Go to the camera's <strong>Settings</strong> (the gear icon).</li>
                            <li>Navigate to <strong>Advanced Settings</strong>.</li>
                            <li>Find and tap on <strong>RTSP</strong>.</li>
                            <li>Toggle RTSP on. You will be prompted to create a username and password. Remember these credentials.</li>
                            <li>The app will then display the RTSP URL. It will look something like: <code>rtsp://username:password@192.168.1.XX/live</code></li>
                        </ol>

                        <h4 className="font-semibold pt-2">Step 2: Add the Camera to Vision EHS</h4>
                         <ol className="list-decimal list-inside space-y-2 pl-4 text-muted-foreground">
                            <li>Navigate to the <strong>Cameras</strong> page in this application.</li>
                            <li>Click on <strong>Add Camera</strong>.</li>
                            <li>For <strong>Ingestion Mode</strong>, select <strong>Direct RTSP Stream</strong>.</li>
                            <li>Paste the RTSP URL from the Wyze app into the <strong>Stream URL</strong> field.</li>
                            <li>Fill out the rest of the form and click <strong>Add Camera</strong>.</li>
                        </ol>
                        <p className="text-sm text-muted-foreground pt-2">Note: This feature is only available on specific Wyze camera models and may require a firmware update. Please consult Wyze's official documentation for more details.</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>What other camera types are supported?</AccordionTrigger>
                <AccordionContent>
                    <p className="pt-2">You can connect any camera that provides a standard RTSP or ONVIF stream. You can also use a connected local webcam for testing and demonstration purposes.</p>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
