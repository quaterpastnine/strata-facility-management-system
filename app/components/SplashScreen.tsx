'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Cloud, CloudRain, Sun, Droplets, Wind, CheckCircle, Sparkles, Zap, Wrench, Calendar, Building2, ArrowRight, Quote } from 'lucide-react';
import { getQuoteOfTheDay } from '@/lib/quotes';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const quote = getQuoteOfTheDay();

  useEffect(() => {
    // Step 0: Welcome message with door image (4 seconds)
    const timer1 = setTimeout(() => setStep(1), 4000);
    
    // Step 1: C.S. Lewis Quote (4 seconds)
    const timer2 = setTimeout(() => setStep(2), 8000);
    
    // Step 2: Weather update (3 seconds)
    const timer3 = setTimeout(() => setStep(3), 11000);
    
    // Step 3: Dashboard updates (3 seconds)
    const timer4 = setTimeout(() => setStep(4), 14000);
    
    // Step 4: Facilities manager note (3 seconds)
    const timer5 = setTimeout(() => setStep(5), 17000);
    
    // Step 5: Summary grid (0.5 second transition)
    const timer6 = setTimeout(() => setStep(6), 17500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  // Countdown timer for summary screen
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => onComplete(), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 overflow-y-auto ${
        countdown === 0 ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Animated background particles - hidden on mobile for better performance */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-8 w-full py-4 sm:py-6 md:py-8">
        
        {/* Step 0: Welcome Message */}
        {step === 0 && (
          <div 
            className="text-center transition-all duration-1000"
            style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 md:mb-8">
              {/* Responsive animated image */}
              <div className="relative animate-[zoomIn_1.5s_ease-out]">
                {/* Image container with responsive sizing */}
                <div 
                  className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-[32rem] lg:h-[32rem] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                  style={{ animation: 'fadeIn 1s ease-out, floatSlow 3s ease-in-out infinite' }}
                >
                  <Image
                    src="/111.jpg"
                    alt="Willow Legg"
                    width={512}
                    height={512}
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, (max-width: 1024px) 320px, 512px"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                
                {/* Animated nameplate below */}
                <div 
                  className="mt-3 sm:mt-4 md:mt-8 bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-2 sm:px-8 sm:py-3 md:px-12 md:py-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-yellow-800"
                  style={{ animation: 'slideUp 1s ease-out 0.5s both' }}
                >
                  <p className="text-white font-bold text-lg sm:text-2xl md:text-3xl lg:text-5xl text-center">Auto Spin Door</p>
                </div>
              </div>
            </div>
            <h1 
              className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4"
              style={{ animation: 'slideDown 0.8s ease-out 0.8s both' }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-yellow-300 animate-pulse" />
              <span className="text-center">Welcome Back, Willow!</span>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-yellow-300 animate-pulse" />
            </h1>
          </div>
        )}

        {/* Step 1: C.S. Lewis Quote */}
        {step === 1 && (
          <div 
            className="text-center transition-all duration-1000"
            style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
            <div className="bg-gradient-to-br from-amber-600/40 to-amber-900/40 backdrop-blur-lg border-4 border-amber-400/50 rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 shadow-2xl max-w-5xl mx-auto">
              <div className="flex items-start gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
                <Quote className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 text-amber-300 flex-shrink-0 animate-pulse" />
                <div className="flex-1 text-left">
                  <p className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-relaxed mb-6 sm:mb-8 md:mb-10 italic font-light">
                    "{quote}"
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-1 sm:h-2 md:h-3 w-12 sm:w-16 md:w-20 bg-amber-400 rounded-full"></div>
                    <p className="text-amber-300 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                      C.S. Lewis
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 md:mt-12">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-300 animate-pulse" />
                <p className="text-amber-200 text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                  Quote of the Day
                </p>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Weather Update */}
        {step === 2 && (
          <div 
          className="text-center transition-all duration-1000"
          style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
          <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 lg:p-16 shadow-2xl">
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 mb-3 sm:mb-6 md:mb-8">
          <Sun className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-yellow-300 animate-spin-slow" />
          <Cloud className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 text-white/80 animate-bounce" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 md:mb-6">Today's Weather</h2>
          <p className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 sm:mb-6 md:mb-8">22°C</p>
          <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl text-white/90 mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <Cloud className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 text-white/80" />
          <span>Partly Cloudy</span>
          <Sun className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 text-yellow-300" />
          </p>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-4 sm:mt-8 md:mt-12">
          <div className="text-center transform hover:scale-110 transition-transform">
          <Droplets className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-blue-300 mx-auto mb-2 animate-bounce" />
          <p className="text-white text-xs sm:text-base md:text-2xl lg:text-3xl">Humidity</p>
          <p className="text-white font-bold text-sm sm:text-xl md:text-3xl lg:text-4xl">65%</p>
          </div>
          <div className="text-center transform hover:scale-110 transition-transform">
          <Wind className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white/80 mx-auto mb-2" />
          <p className="text-white text-xs sm:text-base md:text-2xl lg:text-3xl">Wind</p>
          <p className="text-white font-bold text-sm sm:text-xl md:text-3xl lg:text-4xl">12 km/h</p>
          </div>
          <div className="text-center transform hover:scale-110 transition-transform">
          <CloudRain className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-blue-400 mx-auto mb-2 animate-pulse" />
          <p className="text-white text-xs sm:text-base md:text-2xl lg:text-3xl">Rain</p>
          <p className="text-white font-bold text-sm sm:text-xl md:text-3xl lg:text-4xl">20%</p>
          </div>
          </div>
          </div>
          </div>
        )}

        {/* Step 3: Dashboard Updates */}
        {step === 3 && (
          <div 
          className="text-center transition-all duration-1000"
          style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
          <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 lg:p-16 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-8 md:mb-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-300 animate-pulse" />
          <span>What's New</span>
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-300 animate-pulse" />
          </h2>
          
          <div className="space-y-3 sm:space-y-5 md:space-y-8 text-left">
          <div 
          className="bg-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-5 md:p-8 transform transition-all hover:scale-105"
          style={{ animation: 'slideRight 0.6s ease-out' }}
          >
          <div className="flex items-start gap-2 sm:gap-4 md:gap-6">
          <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-blue-400 flex-shrink-0 animate-bounce" />
          <div>
          <p className="text-white font-bold text-base sm:text-xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 text-green-300" />
          <span>New Booking Confirmed</span>
          </p>
          <p className="text-white/90 text-sm sm:text-base md:text-2xl lg:text-3xl">Tennis Court 1 - Dec 15, 2024 at 3:00 PM</p>
          </div>
          </div>
          </div>

          <div 
          className="bg-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-5 md:p-8 transform transition-all hover:scale-105"
          style={{ animation: 'slideRight 0.6s ease-out 0.2s both' }}
          >
          <div className="flex items-start gap-2 sm:gap-4 md:gap-6">
          <Wrench className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-teal-400 flex-shrink-0 animate-pulse" />
          <div>
          <p className="text-white font-bold text-base sm:text-xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 text-yellow-300" />
          <span>Maintenance Update</span>
          </p>
          <p className="text-white/90 text-sm sm:text-base md:text-2xl lg:text-3xl">AC repair is in progress - Tech #3 assigned</p>
          </div>
          </div>
          </div>

          <div 
          className="bg-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-5 md:p-8 transform transition-all hover:scale-105"
          style={{ animation: 'slideRight 0.6s ease-out 0.4s both' }}
          >
          <div className="flex items-start gap-2 sm:gap-4 md:gap-6">
          <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-orange-400 flex-shrink-0 animate-bounce" />
          <div>
          <p className="text-white font-bold text-base sm:text-xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 text-blue-300" />
          <span>Move Request Approved</span>
          </p>
          <p className="text-white/90 text-sm sm:text-base md:text-2xl lg:text-3xl">Your elevator booking for Nov 28 is confirmed</p>
          </div>
          </div>
          </div>
          </div>
          </div>
          </div>
        )}

        {/* Step 4: Facilities Manager Note */}
        {step === 4 && (
          <div 
          className="text-center transition-all duration-1000"
          style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 md:border-4 border-white/30">
          <div className="mb-3 sm:mb-6 md:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 md:mb-6 shadow-2xl animate-bounce">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-3">Message from Facilities Manager</h2>
          <p className="text-base sm:text-xl md:text-3xl text-white/80">John Smith</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-10 lg:p-12">
          <p className="text-sm sm:text-base md:text-2xl lg:text-4xl text-white leading-relaxed">
          Hi Willow, great news! The shower issue you reported in your maintenance ticket has been 
          <span className="font-bold text-green-200"> completely resolved</span>. 
          Our team replaced the faulty valve and tested everything thoroughly. 
          Everything is working perfectly now. If you have any other concerns, don't hesitate to reach out!
          </p>
          </div>
          
          <div className="mt-4 sm:mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-green-300 animate-pulse" />
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-green-200">Issue Resolved</p>
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-green-300 animate-pulse" />
          </div>
          </div>
          </div>
        )}

        {/* Step 6: Summary Grid */}
        {step === 6 && (
          <div 
            className="transition-all duration-1000"
            style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
            <div className="text-center mb-4 sm:mb-8 md:mb-12">
              <h2 
                className="text-2xl sm:text-3xl md:text-5xl lg:text-8xl font-bold text-white mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4"
                style={{ animation: 'zoomIn 0.8s ease-out' }}
              >
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 text-yellow-300 animate-pulse" />
                <span className="text-center">Your Daily Summary</span>
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 text-yellow-300 animate-pulse" />
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-6 md:mt-8">
                <p className="text-base sm:text-2xl md:text-4xl lg:text-5xl text-white/90 text-center">Proceeding to dashboard in</p>
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/30 rounded-full flex items-center justify-center"
                  style={{ animation: 'pulse 1s ease-in-out infinite' }}
                >
                  <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white">{countdown}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
              {/* Weather Summary */}
              <div 
                className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-xl transform hover:scale-105 transition-all"
                style={{ animation: 'slideRight 0.6s ease-out' }}
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <Sun className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-yellow-300 animate-spin-slow" />
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">Weather</h3>
                    <p className="text-base sm:text-lg md:text-3xl lg:text-4xl text-white/90">22°C Partly Cloudy</p>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-4 md:gap-6 mt-3 sm:mt-4 md:mt-6">
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-300 animate-bounce" />
                    <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl">65%</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <Wind className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white/80" />
                    <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl">12 km/h</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-400 animate-pulse" />
                    <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl">20%</span>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div 
                className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-xl transform hover:scale-105 transition-all"
                style={{ animation: 'slideRight 0.6s ease-out 0.2s both' }}
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-blue-400 animate-bounce" />
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">New Booking</h3>
                    <p className="text-base sm:text-lg md:text-3xl text-white/90">Tennis Court 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-300 animate-pulse" />
                  <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl">Dec 15, 2024 at 3:00 PM</span>
                </div>
              </div>

              {/* Maintenance Summary */}
              <div 
                className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-xl transform hover:scale-105 transition-all"
                style={{ animation: 'slideRight 0.6s ease-out 0.4s both' }}
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <Wrench className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-teal-400 animate-pulse" />
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">Maintenance</h3>
                    <p className="text-base sm:text-lg md:text-3xl text-white/90">AC Repair</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-yellow-300 animate-bounce" />
                  <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl">In Progress - Tech #3</span>
                </div>
              </div>

              {/* Facilities Manager Message */}
              <div 
                className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-xl transform hover:scale-105 transition-all border-2 md:border-4 border-white/30"
                style={{ animation: 'slideRight 0.6s ease-out 0.6s both' }}
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">Manager Note</h3>
                    <p className="text-base sm:text-lg md:text-3xl text-white/80">John Smith</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-300 animate-pulse" />
                  <span className="text-white text-sm sm:text-base md:text-2xl lg:text-3xl font-semibold">Shower Issue Resolved!</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 sm:mt-8 md:mt-12">
              <button
                onClick={() => onComplete()}
                className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/30 hover:bg-white/40 text-white font-bold text-base sm:text-xl md:text-3xl lg:text-4xl px-6 py-3 sm:px-12 sm:py-4 md:px-16 md:py-6 rounded-full transition-all transform hover:scale-105 shadow-xl active:scale-95"
                style={{ animation: 'floatSlow 2s ease-in-out infinite' }}
              >
                Go to Dashboard
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
