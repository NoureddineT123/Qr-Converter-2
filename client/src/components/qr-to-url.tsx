import { useState, useRef } from "react";
import { QrCode, CloudUpload, Search, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function QrToUrl() {
  const [decodedUrl, setDecodedUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [decodeError, setDecodeError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const decodeQrMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/decode-qr", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to decode QR code");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setDecodedUrl(data.url);
      setDecodeError("");
      setSuccessMessage("QR code decoded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Invalidate activities cache to refresh recent activity
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Success!",
        description: "QR code decoded successfully",
      });
    },
    onError: (error) => {
      setDecodeError(error.message);
      setSuccessMessage("");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDecodeError("");
      setSuccessMessage("");
    }
  };

  const handleDecodeQr = () => {
    if (!file) {
      setDecodeError("Please select a QR code image");
      return;
    }
    
    decodeQrMutation.mutate(file);
  };

  const handleCopyToClipboard = async () => {
    if (!decodedUrl) return;
    
    try {
      await navigator.clipboard.writeText(decodedUrl);
      toast({
        title: "Success!",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 rounded-lg p-3 mr-4">
          <QrCode className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">QR Code to URL</h3>
          <p className="text-gray-600 text-sm">Upload a QR code to decode the URL</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Upload QR Code Image
        </Label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={openFileDialog}
        >
          <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Drop your QR code image here</p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">Supports PNG, JPG, JPEG</p>
          {file && (
            <p className="text-sm text-green-600 mt-2">Selected: {file.name}</p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileUpload}
        />
      </div>

      {/* Decoded URL Display */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Decoded URL
        </Label>
        <div className="relative">
          <Input
            type="text"
            value={decodedUrl}
            className="w-full pr-10 bg-gray-50"
            placeholder="Decoded URL will appear here"
            readOnly
          />
          <button
            onClick={handleCopyToClipboard}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 transition-colors"
            disabled={!decodedUrl}
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        {successMessage && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <span className="mr-1">✓</span>
            {successMessage}
          </div>
        )}
        {decodeError && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {decodeError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDecodeQr}
          disabled={decodeQrMutation.isPending}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Search className="h-4 w-4 mr-2" />
          {decodeQrMutation.isPending ? "Decoding..." : "Decode QR Code"}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          disabled={!decodedUrl}
          className="flex-1"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy URL
        </Button>
      </div>
    </div>
  );
}
