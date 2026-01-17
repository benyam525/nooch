"use client";

import { formatFileSize, formatRelativeTime } from "@nooch/shared";
import { File, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  chunkCount: number;
  title: string | null;
  description: string | null;
  createdAt: Date;
}

interface DocumentListProps {
  documents: Document[];
}

const statusConfig = {
  READY: {
    icon: CheckCircle,
    color: "text-green-500",
    label: "Ready",
  },
  PROCESSING: {
    icon: Clock,
    color: "text-yellow-500",
    label: "Processing",
  },
  FAILED: {
    icon: AlertCircle,
    color: "text-red-500",
    label: "Failed",
  },
  UPLOADING: {
    icon: Clock,
    color: "text-blue-500",
    label: "Uploading",
  },
};

export function DocumentList({ documents }: DocumentListProps): React.JSX.Element {
  const handleDelete = async (id: string) => {
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Document deleted");
      // Refresh would happen here
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const status = statusConfig[doc.status as keyof typeof statusConfig];
        const StatusIcon = status?.icon || Clock;

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{doc.title || doc.fileName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>-</span>
                  <span>{formatRelativeTime(doc.createdAt)}</span>
                  {doc.status === "READY" && (
                    <>
                      <span>-</span>
                      <span>{doc.chunkCount} chunks</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 ${status?.color}`}>
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm">{status?.label}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
