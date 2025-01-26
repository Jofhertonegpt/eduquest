"use client";

import { useState } from "react";
import { CreatePost } from "@/components/social/CreatePost";
import { PostList } from "@/components/social/PostList";
import { TrendingTopics } from "@/components/social/TrendingTopics";
import { UserSuggestions } from "@/components/social/UserSuggestions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Chatter() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const { userData } = useProfile();

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="bg-muted rounded-xl p-4">
        <h2 className="font-bold text-xl mb-4">Trending</h2>
        <TrendingTopics />
      </div>

      <div className="bg-muted rounded-xl p-4">
        <h2 className="font-bold text-xl mb-4">Who to follow</h2>
        <UserSuggestions />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-4">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Chatter</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Left Sidebar */}
        <aside className="hidden md:block md:col-span-3 p-4 sticky top-0 h-screen border-r">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Chatter</h1>
            {userData?.profile && (
              <div className="absolute bottom-4 w-full pr-8">
                <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-muted transition cursor-pointer">
                  <img 
                    src={userData.profile.avatar_url || "/placeholder.svg"} 
                    alt={userData.profile.full_name || ""}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{userData.profile.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{userData.user?.email?.split('@')[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-1 md:col-span-6 border-x min-h-screen">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 py-3 border-b">
              <Tabs 
                defaultValue="for-you" 
                className="w-full" 
                onValueChange={(value) => setActiveTab(value as "for-you" | "following")}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="for-you" className="flex-1">For you</TabsTrigger>
                  <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="border-b">
              <CreatePost />
            </div>
            <PostList type={activeTab} />
          </ScrollArea>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block md:col-span-3 p-4 space-y-6 sticky top-0 h-screen">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search"
              className="w-full px-4 py-2 bg-muted rounded-full"
            />
          </div>
          <SidebarContent />
        </aside>
      </div>
    </div>
  );
}