interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export const ProfileStats = ({
  postsCount,
  followersCount,
  followingCount,
}: ProfileStatsProps) => {
  return (
    <div className="flex gap-6 px-4 py-3 text-sm">
      <button className="hover:underline">
        <span className="font-bold">{postsCount}</span>{" "}
        <span className="text-muted-foreground">Posts</span>
      </button>
      <button className="hover:underline">
        <span className="font-bold">{followersCount}</span>{" "}
        <span className="text-muted-foreground">Followers</span>
      </button>
      <button className="hover:underline">
        <span className="font-bold">{followingCount}</span>{" "}
        <span className="text-muted-foreground">Following</span>
      </button>
    </div>
  );
};