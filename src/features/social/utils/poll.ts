export const decodePollResults = (poll: SocialPost["poll"]) => {
  //FIXME: rewrite hacky stuff
  return poll.results?.map((result) => ({
    ...result,
    votes: result.votes ? parseInt(atob((result.votes as any).split("$")[1]), 10) : 0,
  }));
};
