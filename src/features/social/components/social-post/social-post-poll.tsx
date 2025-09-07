import { useMemo, useEffect, useState } from "react";
import { addHours, differenceInMilliseconds } from "date-fns";
import { useVotePoll } from "@/features/social/queries/use-vote-poll";

export const SocialPostPoll = ({ socialPost }: { socialPost: SocialPost }) => {
  const votePoll = useVotePoll();

  if (
    !socialPost.poll ||
    !socialPost.poll.results ||
    (socialPost.poll as any).length === 0
  ) {
    //FIXME: wrong types -> fix on backend
    return null;
  }

  const isVoted = Boolean(socialPost.poll.pollVotedId);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        {socialPost.poll.results.map((pollOption, index) => (
          <PollOption
            key={`poll-option-${index}`}
            pollOption={pollOption}
            isVoted={isVoted}
            selected={Boolean(socialPost.poll.pollVotedId === pollOption.id)}
            totalVotes={
              socialPost.poll.results.reduce(
                (acc, curr) => acc + curr.votes,
                0,
              ) || 0
            }
            onVote={() =>
              votePoll.mutate({
                postId: socialPost._id,
                choiceId: pollOption.id,
              })
            }
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {isVoted ? (
          <p className="text-sm">{`\u2022 Answered`}</p>
        ) : (
          <p className="text-sm">{`\u2022 This is a poll, select an option to see results`}</p>
        )}
        <PollTimer createdAt={socialPost.createdAt} />
      </div>
    </div>
  );
};

const PollOption = ({
  pollOption,
  isVoted,
  selected,
  totalVotes,
  onVote,
}: {
  pollOption: PollOption;
  isVoted: boolean;
  selected: boolean;
  totalVotes: number;
  onVote: () => void;
}) => {
  const percentage = useMemo(
    () => (totalVotes > 0 ? (pollOption.votes / totalVotes) * 100 : 0),
    [pollOption.votes, totalVotes],
  );

  return (
    <div
      className={`relative flex w-full justify-between border rounded-md px-3
        py-2 bg-base-300 transition ${
          selected
            ? "border-brand-100 pointer-events-none"
            : isVoted
              ? "pointer-events-none"
              : "hover:bg-base-400 hover:border-base-600"
        } cursor-pointer overflow-hidden`}
      onClick={onVote}
    >
      {isVoted && (
        <div
          className={`absolute inset-0 flex
          ${selected ? "bg-brand-200-alpha " : "bg-brand-100-alpha"}`}
          style={{ width: `${percentage.toFixed(0)}%` }}
        />
      )}
      <p className="text-white">{pollOption.text}</p>
      {isVoted && <p>{percentage.toFixed(0)}%</p>}
    </div>
  );
};

const PollTimer = ({ createdAt }: { createdAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiration = addHours(new Date(createdAt), 24);
      const distance = differenceInMilliseconds(expiration, now);

      if (distance <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <div className="flex w-[135px]">
      <p className="text-sm whitespace-nowrap">
        {timeLeft ? `Ends in ${timeLeft}` : "Poll has ended"}
      </p>
    </div>
  );
};
