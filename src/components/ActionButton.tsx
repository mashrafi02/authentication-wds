"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ActionButtonProps {
  action: () => Promise<unknown> | void;
  successMessage?: string;
  errorMessage?: string;
  loadingText?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  requireAreYouSure?: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
}

export const ActionButton = ({
  action,
  successMessage,
  errorMessage,
  asChild = false,
  children,
  disabled = false,
  className= "",
  requireAreYouSure = false, // ✅ default false
  ...props
}: ActionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    try {
      setIsLoading(true);

      await action();

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.message || errorMessage || "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ If no confirmation required → normal button
  if (!requireAreYouSure) {
    return (
      <Button
        {...props}
        asChild={asChild}
        disabled={isLoading || disabled}
        onClick={handleAction}
        className={className}
      >
        <LoadingSwap isLoading={isLoading}>
          {children}
        </LoadingSwap>
      </Button>
    );
  }

  // ✅ If confirmation required → wrap with AlertDialog
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          {...props}
          asChild={asChild}
          disabled={isLoading || disabled}
        >
          <LoadingSwap isLoading={isLoading}>
            {children}
          </LoadingSwap>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} className="bg-destructive text-destructive-foreground">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
