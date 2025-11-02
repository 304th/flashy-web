import {ConversationErrorIcon} from "@/components/ui/icons/conversation-error";

export const ConversationNotAllowedError = ({ error }: { error: string }) => {
  if (error.includes('does not allow conversations')) {
    return <ChatError
      title="Not Friends"
      error={error}
    />
  } else if (error.includes('blocked')) {
    return <ChatError
      title="Blocked"
      error={error}
    />
  } else if (error.includes('is not able to receive any messages at the moment')) {
    return <ChatError
      title="User Banned"
      error={error}
    />
  } else if (error.includes('is not accepting direct messages at the moment')) {
    return <ChatError
      title="User Busy"
      error={error}
    />
  }
}

const ChatError = ({ title, error }: { title: string; error: string; }) => {
  return <div className="flex flex-col text-center justify-center items-center gap-4 max-w-[400px]">
    <div className="flex flex-col">
      <p className="text-white font-medium text-xl">
        {title}
      </p>
      <p>
        {error}
      </p>
    </div>
    <ConversationErrorIcon />
  </div>
}