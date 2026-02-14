"use client"

import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/o-auth-provider";
import { ActionButton } from "@/components/ActionButton";

const SocialAuthButtons = () => {

  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <ActionButton
        key={provider}
        variant="outline"
        successMessage="Redirecting..."
        errorMessage="Social login failed"
        action={() =>
          authClient.signIn.social({
            provider,
            callbackURL: "/",
          })
        }
      >
        <div className="flex items-center gap-x-1">
          <Icon className="h-4 w-4" />
          {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        </div>
      </ActionButton>
    );
  });
};

export default SocialAuthButtons;
