"use client";

import Link from "next/link";
import { Loadable } from "@/components/ui/loadable";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
import { ConversationOnline } from "@/features/messaging/components/conversation-title/conversation-online";
import { useQueryParams } from "@/hooks/use-query-params";
import { useActiveConversation } from "@/features/messaging/hooks/use-active-conversation";
import { useUserAgreement } from "@/features/business/queries/use-user-agreement";
import { useMe } from "@/features/auth/queries/use-me";

export const ConversationHeader = () => {
  const conversationId = useQueryParams("id");
  const isNewConversation = useQueryParams("new");

  if (!conversationId) {
    return null;
  }

  return (
    <div
      className="relative flex w-full rounded-md bg-base-250 min-h-[72px]
        z-[1000]"
    >
      <div className="flex flex-col p-4 gap-0 w-full">
        {isNewConversation ? (
          <NewlyCreatedConversationHeader />
        ) : (
          <ExistingConversationHeader />
        )}
      </div>
    </div>
  );
};

const NewlyCreatedConversationHeader = () => {
  const { data: conversation } = useActiveConversation();

  if (!conversation) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <ConversationThumbnail conversation={conversation} />
        <ConversationTitle conversation={conversation} />
      </div>
      {/*<AgreementBanner conversation={conversation} />*/}
    </>
  );
};

const ExistingConversationHeader = () => {
  const conversationQuery = useActiveConversation();

  return (
    <Loadable queries={[conversationQuery] as any}>
      {() =>
        conversationQuery.data ? (
          <>
            <div className="flex items-center gap-3 w-full">

              <ConversationThumbnail conversation={conversationQuery.data} />
              <div className="flex flex-col gap-0">

                <ConversationTitle conversation={conversationQuery.data} />
                <ConversationOnline conversation={conversationQuery.data} />

              </div>
            </div>
            <AgreementBanner conversation={conversationQuery.data} />
          </>
        ) : null
      }
    </Loadable>
  );
};

const AgreementBanner = ({
  conversation,
}: {
  conversation: Conversation | undefined;
}) => {
  const { data: me } = useMe();

  const otherUserId = conversation?.members?.find(
    (m) => m.fbId !== me?.fbId,
  )?.fbId;

  const { data: agreementData } = useUserAgreement(otherUserId);

  if (!agreementData?.hasAgreement || !agreementData.agreement) {
    return null;
  }

  return (
    <div className="absolute w-full left-0 -bottom-8 rounded-b-md flex gap-2 bg-base-200 justify-center items-center text-sm text-base-700 h-9">
      The user is an approved partner with a signed agreement.{" "}
      <Link
        href={`/business/agreements?id=${agreementData.agreement._id}`}
        className="text-brand-100 hover:underline"
      >
        View Agreement
      </Link>
    </div>
  );
};