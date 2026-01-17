"use client";

import { useState } from "react";
import { formatRelativeTime, getInitials } from "@nooch/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, X, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Approval {
  id: string;
  originalContent: string;
  confidence: number | null;
  createdAt: Date;
  message: {
    conversation: {
      clientProfile: {
        user: {
          firstName: string | null;
          lastName: string | null;
          email: string;
          imageUrl: string | null;
        };
      };
      messages: Array<{ content: string }>;
    };
  };
}

interface ApprovalQueueProps {
  approvals: Approval[];
}

export function ApprovalQueue({ approvals: initialApprovals }: ApprovalQueueProps): React.JSX.Element {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500));
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      toast.success("Response approved and sent to client");
    } catch (error) {
      toast.error("Failed to approve response");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      toast.success("Response rejected");
    } catch (error) {
      toast.error("Failed to reject response");
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = (approval: Approval) => {
    setEditingId(approval.id);
    setEditContent(approval.originalContent);
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      toast.success("Edited response sent to client");
    } catch (error) {
      toast.error("Failed to save edit");
    } finally {
      setLoading(null);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const client = approval.message.conversation.clientProfile.user;
        const clientMessage =
          approval.message.conversation.messages[0]?.content || "No message";
        const isEditing = editingId === approval.id;
        const isLoading = loading === approval.id;

        return (
          <Card key={approval.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client.imageUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(client.firstName, client.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(approval.createdAt)}
                    </p>
                  </div>
                </div>
                {approval.confidence && (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {Math.round(approval.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Client's message:
                </p>
                <p className="rounded-lg bg-muted p-3 text-sm">{clientMessage}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  AI-generated response:
                </p>
                {isEditing ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                ) : (
                  <p className="rounded-lg border bg-card p-3 text-sm">
                    {approval.originalContent}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => handleSaveEdit(approval.id)}
                    disabled={isLoading}
                  >
                    Save & Send
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleApprove(approval.id)}
                    disabled={isLoading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(approval)}
                    disabled={isLoading}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(approval.id)}
                    disabled={isLoading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
