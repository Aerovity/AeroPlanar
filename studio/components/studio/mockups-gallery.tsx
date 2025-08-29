"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Eye, User, Trash2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface SharedMockup {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_size: number;
  view_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export function MockupsGallery() {
  const [mockups, setMockups] = useState<SharedMockup[]>([]);
  const [filteredMockups, setFilteredMockups] = useState<SharedMockup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMockups();
    getCurrentUser();
  }, []);

  useEffect(() => {
    filterMockups();
  }, [searchQuery, mockups]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  };

  const fetchMockups = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_mockups')
        .select(`
          *,
          profiles (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Database error:', error);
        // Don't show error toast for empty table, just set empty array
        setMockups([]);
      } else {
        setMockups(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching mockups:', error);
      setMockups([]);
      // Only show toast for actual errors, not empty results
      if (error.message && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        toast({
          title: "Failed to load mockups",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterMockups = () => {
    if (!searchQuery.trim()) {
      setFilteredMockups(mockups);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mockups.filter(mockup => {
      const name = mockup.name.toLowerCase();
      const description = mockup.description?.toLowerCase() || "";
      const username = mockup.profiles?.username?.toLowerCase() || "";
      const firstName = mockup.profiles?.first_name?.toLowerCase() || "";
      const lastName = mockup.profiles?.last_name?.toLowerCase() || "";

      return name.includes(query) || 
             description.includes(query) || 
             username.includes(query) || 
             firstName.includes(query) || 
             lastName.includes(query);
    });

    setFilteredMockups(filtered);
  };

  const handleDownload = async (mockup: SharedMockup) => {
    try {
      // Increment view count
      await supabase
        .from('shared_mockups')
        .update({ view_count: mockup.view_count + 1 })
        .eq('id', mockup.id);

      // Trigger download
      const link = document.createElement('a');
      link.href = mockup.file_url;
      link.download = `${mockup.name}.glb`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state
      setMockups(prev => prev.map(m => 
        m.id === mockup.id ? { ...m, view_count: m.view_count + 1 } : m
      ));

      toast({
        title: "Download started",
        description: `Downloading ${mockup.name}`,
      });
    } catch (error: any) {
      console.error('Error downloading mockup:', error);
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (mockupId: string) => {
    try {
      const { error } = await supabase
        .from('shared_mockups')
        .delete()
        .eq('id', mockupId)
        .eq('user_id', currentUser);

      if (error) throw error;

      setMockups(prev => prev.filter(m => m.id !== mockupId));
      toast({
        title: "Mockup deleted",
        description: "Your mockup has been removed from the gallery",
      });
    } catch (error: any) {
      console.error('Error deleting mockup:', error);
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getDisplayName = (profile: SharedMockup['profiles']) => {
    if (profile.username) return `@${profile.username}`;
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return "Anonymous User";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c3b383]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search mockups by name, description, or creator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredMockups.length} of {mockups.length} mockups
      </div>

      {/* Mockups Grid */}
      {filteredMockups.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-lg mb-2">
            {searchQuery ? "No mockups found" : "No mockups available yet"}
          </p>
          <p className="text-sm mb-4">
            {searchQuery 
              ? "Try adjusting your search terms" 
              : "Be the first to share a mockup with the community!"
            }
          </p>
          {!searchQuery && (
            <div className="text-xs text-gray-500 bg-gray-900/50 rounded-lg p-3 max-w-md mx-auto">
              <p className="mb-2">💡 <strong>How to share:</strong></p>
              <p>1. Create your 3D scene in the studio</p>
              <p>2. Click the download button to export as GLB</p>
              <p>3. Click the share button and upload your GLB file</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredMockups.map((mockup, index) => (
            <motion.div
              key={mockup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 hover:border-[#c3b383]/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-[#c3b383]/10">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg mb-3 line-clamp-1">
                        {mockup.name}
                      </h3>
                      {mockup.description && (
                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                          {mockup.description}
                        </p>
                      )}
                    </div>
                    {currentUser === mockup.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(mockup.id)}
                        className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-10 h-10 ring-2 ring-gray-700">
                      <AvatarImage src={mockup.profiles.avatar_url || ""} />
                      <AvatarFallback className="bg-gray-700 text-gray-300">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm text-gray-300 font-medium block">
                        {getDisplayName(mockup.profiles)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Creator
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="secondary" className="text-xs bg-gray-800/60 text-gray-300 px-3 py-1.5 font-medium">
                      {formatFileSize(mockup.file_size)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-gray-800/60 text-gray-300 px-3 py-1.5 font-medium">
                      <Eye className="w-3 h-3 mr-1.5" />
                      {mockup.view_count} views
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-gray-800/60 text-gray-300 px-3 py-1.5 font-medium">
                      {formatDistanceToNow(new Date(mockup.created_at), { addSuffix: true })}
                    </Badge>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(mockup)}
                    className="w-full bg-[#c3b383] hover:bg-[#b5a374] text-black text-sm h-12 font-semibold transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download GLB
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}