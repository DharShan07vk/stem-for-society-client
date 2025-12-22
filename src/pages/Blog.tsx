import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components1/ui/button';
import { Input } from '@/components1/ui/input';
import { Search, Plus, ArrowLeft, Share2, FileText, PenTool, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { AxiosError } from "axios";
import Errorbox from "../components/Errorbox";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { formatDate } from "../lib/utils";
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

export type Blog = {
  id: string;
  slug: string;
  reference: string[];
  category: string;
  title: string;
  content: string;
  createdAt: string;
  coverImage: string;
  blogAuthor: {
    name: string;
    linkedin: string;
    designation?: string;
  }
}

function useBlog() {
  return useQuery<GenericResponse<Blog[]>, AxiosError<GenericError>>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api().get('/blogs');
      return response.data;
    },
    staleTime: 1000 * 60 * 300, // 5 minutes
  });
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { data: blogPosts, isLoading, error } = useBlog();
  const { isShowing, handleShare } = useShare();
  
  if (error) { 
    //@ts-expect-error - error is of type AxiosError
    return <Errorbox message={error.response?.data.error || 'An error occurred'} />;
  }
  
  const blogs = isLoading ? [] : blogPosts?.data || [];

  // Filter blogs based on search query with null/undefined checks
  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = blogs.filter(blog => {
        // Safe string comparisons with null/undefined checks
        const title = blog.title?.toLowerCase() || '';
        const content = blog.content?.toLowerCase() || '';
        const authorName = blog.blogAuthor?.name?.toLowerCase() || '';
        const category = blog.category?.toLowerCase() || '';
        const designation = blog.blogAuthor?.designation?.toLowerCase() || '';

        return (
          title.includes(query) ||
          content.includes(query) ||
          authorName.includes(query) ||
          category.includes(query) ||
          designation.includes(query)
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => 
        blog.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered;
  }, [blogs, searchQuery, selectedCategory]);

  // Pagination logic
  const totalItems = filteredBlogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  const categories = ["All", "Education", "Career", "Research", "Technology", "Innovation"];

  // Check if there are no blogs at all (not just filtered results)
  const noBlogsAvailable = !isLoading && blogs.length === 0;

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-50 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
                linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
              `,
              backgroundSize: '100px 100px',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          />

          {/* Content above grid */}
          <div className="relative z-10">
            <Header />
            <div className="text-center mb-8 pt-4">
              <p className="text-base text-gray-600 mb-1">Explore Blogs</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0389FF] relative inline-block">
                <span className="relative">
                  Scientific Communication
                  <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Description skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mt-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-[#E8F4FD] rounded-xl p-6 h-32 animate-pulse"></div>
            </div>
          </div>

          {/* Blog cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        />

        {/* Content above grid */}
        <div className="relative z-10">
          <Header />

          {/* Navigation Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <p className="text-base text-gray-600 mb-1">Explore Blogs</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0389FF] relative inline-block">
              <span className="relative">
                Scientific Communication
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-[832px]  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Content - Description */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-black text-sm leading-relaxed">
              Join us in making your research matter to everyone—let's empower society with 
              knowledge and encourage curiosity about the world around us! Every month for 
              the best scientific communication and Outstanding contributions will be rewarded 
              with prizes and certificates of appreciation, recognizing your efforts to make 
              science accessible and engaging for all.
            </p>
            <p className="text-black text-sm leading-relaxed">
              Stem for Society invites Scientist, Postdoc, PhD, masters, bachelor students and 
              researchers to share their research journey by writing blogs about their publication 
              or scientific information aimed at the general public and society! By sharing 
              insights and engaging with readers, you can foster community connections and 
              encourage meaningful discussions around your research.
            </p>
          </div>

          {/* Right Content - Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#E8F4FD] rounded-xl p-6 text-center">
              <p className="text-[#0389FF] h-[150px] text-xl">
                Getting your article published typically takes about a day to get verified
              </p>
              <Link to="/blog-article">
                <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-6 py-2 rounded-lg font-medium">
                  CREATE ARTICLE
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {noBlogsAvailable ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Currently No Articles Available
              </h3>
              <p className="text-lg text-gray-600 mb-2">
                Be the first to share your knowledge and insights!
              </p>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start the conversation by creating the first article on our Scientific Communication Platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/blog-article">
                  <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 h-12 px-8 rounded-full text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Article
                  </Button>
                </Link>
                
                <Link to="/courses">
                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-gray-50 border-gray-300 h-12 px-8 rounded-full flex items-center"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedBlogs.map((post) => (
                <Link key={post.id} to={`/blog-post/${post.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                    {/* Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-xl">
                      <img
                        src={post.coverImage || '/placeholder-image.jpg'}
                        alt={post.title || 'Blog post'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Category Badge */}
                      {post.category && (
                        <span className="inline-block bg-[#F2F2F2] text-[#0389FF] px-3 py-1 rounded-md text-xs font-medium mb-3">
                          {post.category}
                        </span>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                        {post.title || 'Untitled Article'}
                      </h3>

                      {/* Author and Date */}
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {(post.blogAuthor?.name || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-600">{post.blogAuthor?.name || 'Anonymous'}</span>
                        <span className="text-gray-400">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 p-0 border-gray-300 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 p-0 border-gray-300 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default Blog;
