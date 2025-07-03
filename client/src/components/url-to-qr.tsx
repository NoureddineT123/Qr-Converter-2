import { useState } from "react";
import { Link, QrCode, Download, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function UrlToQr() {
  const [url, setUrl] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateQrMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/generate-qr", { url });
      return response.json();
    },
    onSuccess: (data) => {
      setQrCodeDataUrl(data.qrCodeDataUrl);
      setUrlError("");
      // Invalidate activities cache to refresh recent activity
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Success!",
        description: "QR code generated successfully",
      });
    },
    onError: (error) => {
      setUrlError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setUrlError("");
    
    // Real-time validation
    if (value && !isValidUrl(value)) {
      setUrlError("Please enter a valid URL");
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerateQr = () => {
    if (!url.trim()) {
      setUrlError("Please enter a URL");
      return;
    }
    
    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    generateQrMutation.mutate(url);
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success!",
      description: "QR code downloaded successfully",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-brand-100 rounded-lg p-3 mr-4">
          <Link className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">URL to QR Code</h3>
          <p className="text-gray-600 text-sm">Enter a URL to generate a QR code</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-6">
        <Label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          Website URL
        </Label>
        <div className="relative">
          <Input
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            className="w-full pl-4 pr-10"
            placeholder="https://example.com"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Link className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {urlError && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {urlError}
          </div>
        )}
      </div>

      {/* QR Code Display */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          {qrCodeDataUrl ? (
            <div className="qr-result">
              <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
                <img
                  src={qrCodeDataUrl}
                  alt="Generated QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">QR code for: {url}</p>
            </div>
          ) : (
            <div className="qr-placeholder">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">QR code will appear here</p>
              <p className="text-sm text-gray-500 mt-1">Enter a URL above to generate</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleGenerateQr}
          disabled={generateQrMutation.isPending}
          className="flex-1 bg-brand-600 hover:bg-brand-700"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {generateQrMutation.isPending ? "Generating..." : "Generate QR Code"}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!qrCodeDataUrl}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
