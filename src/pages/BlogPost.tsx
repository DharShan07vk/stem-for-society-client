import React from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { ArrowLeft, Share2, Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components1/ui/button';
import BlogContent from "../components/BlogContent";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { Blog } from "./BlogListing";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import Errorbox from "../components/Errorbox";
import { formatDate } from "../lib/utils";
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

function useBlog(slug: string) {
  return useQuery<GenericResponse<Blog>, AxiosError<GenericError>>({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await api().get(`/blogs/${slug}`);
      return response.data;
    },
  });
};

// Helper function to check if a string is a valid URL
const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to format URL for display
const formatUrlForDisplay = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch (_) {
    return url;
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isShowing, handleShare } = useShare();
  
  if(!id) {
    navigate(-1);
  }
  const { data, isLoading, error } = useBlog(id!);

  if(isLoading) {
    return <Loading />;
  }

  if(error) {
    // @ts-expect-error - error is of type AxiosError
    return <Errorbox message={error.response?.data.error} />;
  }

  const blogPost = data?.data;
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Grid Background */}
      <div className="relative overflow-hidden min-h-[120px] md:min-h-[180px]">
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/blog">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-[#E8F4FD] text-[#0389FF] px-3 py-1 rounded-md text-sm font-medium">
            {blogPost.category}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {blogPost.title}
        </h1>

        {/* Author Info */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {(blogPost.blogAuthor?.name || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{blogPost.blogAuthor.name}</span>
          <span className="text-gray-400 text-sm">{formatDate(blogPost.createdAt)}</span>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden w-full h-auto max-h-[60vh] flex items-center justify-center">
            <img
              src={blogPost.coverImage}
              alt={blogPost.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-gray max-w-none mb-12">
          <div className="text-gray-700 text-base leading-relaxed [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-[#0389FF] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>img]:rounded-xl [&>img]:my-6">
            <BlogContent markdownContent={blogPost.content} />
          </div>
        </article>

        {/* References */}
        {blogPost.references && blogPost.references.length > 0 && (
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
            <div className="space-y-2">
              {blogPost.references.map((reference, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-gray-500 font-medium flex-shrink-0">
                    [{index + 1}]
                  </span>
                  {isValidUrl(reference) ? (
                    <a
                      href={reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0389FF] hover:underline flex items-center space-x-1 break-all"
                    >
                      <span>{formatUrlForDisplay(reference)}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-gray-600 break-words">{reference}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default BlogPost;
