"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/o-auth-provider";
import { LoadingSwap } from "@/components/ui/loading-swap";

const SocialAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <Button
        key={provider}
        variant="outline"
        disabled={loadingProvider !== null}
        onClick={async () => {
          try {
            setLoadingProvider(provider);

            await authClient.signIn.social({
              provider,
              callbackURL: "/",
            });

            toast.success("Redirecting...");
          } catch (error: any) {
            console.error(error);

            toast.error(
              error?.message || "Something went wrong. Please try again."
            );

            setLoadingProvider(null);
          }
        }}
      > <LoadingSwap isLoading={loadingProvider === provider} className="flex items-center gap-x-1">
            <Icon className="mr-2 h-4 w-4" />
            {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        </LoadingSwap>
      </Button>
    );
  });
};

export default SocialAuthButtons;
