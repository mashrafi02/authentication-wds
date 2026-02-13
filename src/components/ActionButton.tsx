"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";

interface ActionButtonProps {
  action: () => Promise<unknown> | void;
  successMessage?: string;
  errorMessage?: string;
  loadingText?: string;
  asChild?:boolean,
  children?: React.ReactNode;
  disabled?:boolean;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined
}

export const ActionButton = ({
  action,
  successMessage,
  errorMessage,
  asChild=false,
  children,
  disabled=false,
  ...props
}: ActionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      await action();

      if (successMessage) {
        toast.success(successMessage);
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(error);
        
      toast.error(
        error?.message || errorMessage || "Something went wrong."
      );
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...props}
      asChild={asChild}
      disabled={isLoading || disabled}
      onClick={handleClick}
    >
      <LoadingSwap isLoading={isLoading}>
        {children}
      </LoadingSwap>
    </Button>
  );
};
