import { Link, QrCode, Download, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface QrActivity {
  id: number;
  url: string;
  type: "generate" | "decode";
  createdAt: string;
}

export default function RecentActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery<QrActivity[]>({
    queryKey: ["/api/activities"],
  });

  const clearActivitiesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/activities");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Success!",
        description: "All activities cleared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const generateQrCode = async (url: string) => {
    try {
      const response = await apiRequest("POST", "/api/generate-qr", { url });
      const data = await response.json();
      
      // Download the QR code
      const link = document.createElement("a");
      link.href = data.qrCodeDataUrl;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success!",
        description: "QR code generated and downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => clearActivitiesMutation.mutate()}
          disabled={clearActivitiesMutation.isPending || !activities?.length}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Clear All
        </Button>
      </div>

      {!activities?.length ? (
        <div className="text-center py-8">
          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
          <p className="text-sm text-gray-500 mt-1">
            Generated and decoded QR codes will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <div className={`rounded-lg p-2 mr-3 ${
                  activity.type === "generate" 
                    ? "bg-brand-100" 
                    : "bg-green-100"
                }`}>
                  {activity.type === "generate" ? (
                    <Link className={`h-4 w-4 ${
                      activity.type === "generate"
                        ? "text-brand-600"
                        : "text-green-600"
                    }`} />
                  ) : (
                    <QrCode className={`h-4 w-4 ${
                      activity.type === "generate"
                        ? "text-brand-600"
                        : "text-green-600"
                    }`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {activity.url}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.type === "generate" ? "Generated" : "Decoded"}{" "}
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.type === "generate" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generateQrCode(activity.url)}
                    className="text-gray-400 hover:text-brand-600 p-1"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {activity.type === "decode" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenUrl(activity.url)}
                    className="text-gray-400 hover:text-brand-600 p-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyUrl(activity.url)}
                  className="text-gray-400 hover:text-brand-600 p-1"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
