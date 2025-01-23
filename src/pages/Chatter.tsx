import { useState } from "react";
import { motion } from "framer-motion";
import { CreatePost } from "@/components/social/CreatePost";
import { PostList } from "@/components/social/PostList";
import { TrendingTopics } from "@/components/social/TrendingTopics";
import { UserSuggestions } from "@/components/social/UserSuggestions";

const Chatter = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "trending">("feed");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <TrendingTopics />
        </div>

        {/* Main Content */}
        <div className="md:col-span-6 space-y-6">
          <CreatePost />
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "feed"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "trending"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              Trending
            </button>
          </div>
          <PostList type={activeTab} />
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <UserSuggestions />
        </div>
      </div>
    </motion.div>
  );
};

export default Chatter;