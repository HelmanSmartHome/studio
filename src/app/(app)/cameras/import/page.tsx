import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BulkImportPage() {
  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Bulk Import Cameras
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload CSV</CardTitle>
            <CardDescription>
              Select a CSV file with your camera information. Ensure the file has headers like 'cameraName', 'siteId', 'zoneId', 'streamUrl', etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="csv-file">Camera CSV File</Label>
                <div className="relative">
                  <Input id="csv-file" type="file" className="pl-14" />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <Button>Upload and Preview</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Step 2: Map Columns and Import</CardTitle>
            <CardDescription>
              After uploading, you'll be able to map your CSV columns to the required camera fields and start the import process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">Preview will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
