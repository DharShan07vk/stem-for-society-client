import React, { useState } from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { Button } from '@/components1/ui/button';
import { ArrowLeft, Share2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

const CampusAmbassador = () => {
  const [copied, setCopied] = useState(false);
  const { isShowing, handleShare } = useShare();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="relative overflow-hidden min-h-screen" style={{ height: '100%', minHeight: '100%' }}>
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none z-0"
          style={{
            minHeight: '100vh',
            backgroundImage: `
              linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
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

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium text-[#000000] relative inline-block">
              <span className="relative text-2xl md:text-3xl">
                Campus Ambassador Program!
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg">
          <img 
            src="/lovable-uploads/img5.png"
            alt="Campus Ambassador Program" 
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8">
              <p className="text-white text-lg leading-relaxed max-w-4xl">
                Embrace the role of a Stem For Society initiated to Support students with ambassador at your college or university and help us spread the excitement far and wide! As a Campus Ambassador, you will be instrumental in promoting the festival, engaging with fellow students, and infusing the spirit of Stem for Society into your campus community
              </p>
            </div>
          </div>
        </div>

        {/* Why Join Section */}
        <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="bg-[#C0E1FF] px-6 py-4">
            <span className="text-xl  text-black">
              Why Join?
            </span>
          </div>
          <div className="bg-white p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-base">
                Access to exclusive STEM for Society opportunities and a chance to win a Campus Ambassador Points
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-base">
                Certificates of recognition for your contributions
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-base">
                Opportunities to network with fellow participants and free access to Stem for Society Conference
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-base">
                30% discount in all the program offered by Stem for Society
              </p>
            </div>
          </div>
        </div>

        {/* Ready to Apply Section */}
        <div className="rounded-2xl overflow-hidden mb-12 shadow-sm">
          <div className="bg-[#C0E1FF] px-6 py-4">
            <h2 className="text-xl  text-black">
              Ready to apply?
            </h2>
          </div>
          <div className="bg-white p-6">
            <p className="text-gray-700 text-base mb-6">
              Sign up today to embark on this exciting journey. Let's make Stem for Society unforgettable together!
            </p>
            <div className="text-right">
              <Link to="/campus-ambassador-booking">
                <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-6 py-2 rounded-lg text-sm font-semibold">
                  REGISTER NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Mini Popup Notification */}
      {copied && (
        <div className="fixed top-6 right-6 bg-black-900 text-black px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out">
          ✅ Copied the URL!
        </div>
      )}

      {/* Tailwind animation (add this in globals.css if not already present) */}
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-out {
            animation: fadeInOut 2s ease-in-out;
          }
        `}
      </style>
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default CampusAmbassador;
