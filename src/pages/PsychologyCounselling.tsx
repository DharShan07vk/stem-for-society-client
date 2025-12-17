
import React from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import GridBackground from '@/components1/GridBackground';
import { Button } from '@/components1/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

const PsychologyCounselling = () => {
  const { isShowing, handleShare } = useShare();
  return (
    <div className="min-h-screen bg-white">
      <GridBackground>
        <Header />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
                style={{ backgroundColor: '#00549FB8' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
              style={{ backgroundColor: '#00549FB8' }}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium text-[#000000] relative inline-block">
              <span className="relative">
                Psychology Counselling
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>

          {/* Hero Image Section */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img 
              src="/lovable-uploads/img1.png" 
              alt="Psychology Counselling" 
              className="w-full h-[350px] md:h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
              <div className="p-6 md:p-8">
                <p className="text-white text-sm md:text-base leading-relaxed max-w-2xl">
                  Stem For Society Initiated to Support students with psychological problems is 
                  essential for their well-being and academic success.
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Stem For Society, establishing open communication channels allows students to express their 
              feelings and seek help without stigma. Providing access to counselling services ensures that 
              students receive professional support tailored to their needs
            </p>
          </div>

          {/* Service Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Service Info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="bg-[#FFF8E1] rounded-lg px-4 py-3 mb-5 flex items-center gap-3">
                <Icon icon="cuida:alert-outline" className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-[#92400E] text-sm font-medium">Your identity will be 100% confidential</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Psychology Counselling for Students
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Talk to trained experts about your mental health, 
                academics, or stress - safely and without judgment.
              </p>
            </div>

            {/* Right Column - Pricing */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">₹ 2,000.00</span>
                <span className="text-gray-500 text-sm">/ For 30 mins</span>
              </div>
              
              <div className="bg-[#ECFDF5] rounded-xl px-4 py-3 flex items-start gap-3">
                <Icon icon="ic-baseline-discount" className="w-5 h-5 text-[#85E185] mt-0.5 flex-shrink-0" />
                <p className="text-[#000000CC] text-sm font-mediumleading-relaxed">
                  If you have a Valid student (UG/PG/Ph.D) ID card 75% fee will be waived off by Stem for Society.
                </p>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <div className="flex justify-end mb-8">
            <Link to="/mental-wellbeing-counselling">
              <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 rounded-full font-semibold text-sm">
                BOOK YOUR SESSION
              </Button>
            </Link>
          </div>
        </div>
      </GridBackground>

      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default PsychologyCounselling;
