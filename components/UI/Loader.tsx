import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-cocoa/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-cocoa border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="font-mono text-sm text-cocoa/70 tracking-widest animate-pulse">
        SCANNING_NETWORK...
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-givry/50 h-[320px] rounded-xl border border-cocoa/10 overflow-hidden animate-pulse">
      <div className="h-40 bg-cocoa/10 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-cocoa/10 rounded w-3/4" />
        <div className="h-4 bg-cocoa/10 rounded w-1/2" />
        <div className="flex gap-2 mt-4">
          <div className="h-5 w-12 bg-cocoa/10 rounded-full" />
          <div className="h-5 w-12 bg-cocoa/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGameDetail: React.FC = () => {
  return (
    <div className="pb-12 animate-pulse w-full">
      {/* Back Button */}
      <div className="mb-6 h-10 w-32 bg-givry/30 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col */}
        <div className="lg:col-span-1 space-y-6">
          {/* Thumbnail */}
          <div className="rounded-xl overflow-hidden border-2 border-cocoa/10 bg-givry/20 aspect-video w-full" />
          
          {/* Actions */}
          <div className="space-y-4">
             <div className="h-14 w-full bg-givry/30 rounded-lg border border-cocoa/5" />
             <div className="flex gap-2">
               <div className="h-10 flex-1 bg-givry/30 rounded-lg border border-cocoa/5" />
               <div className="h-10 flex-1 bg-givry/30 rounded-lg border border-cocoa/5" />
             </div>
          </div>

          {/* Meta */}
          <div className="bg-givry/50 p-6 rounded-xl border border-cocoa/10 h-64 space-y-4">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-16 bg-cocoa/10 rounded" />
                  <div className="h-4 w-24 bg-cocoa/10 rounded" />
                </div>
             ))}
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-givry p-8 rounded-2xl border border-cocoa/10 min-h-[180px] space-y-4">
             <div className="h-10 w-3/4 bg-cocoa/10 rounded" />
             <div className="space-y-2 pt-2">
               <div className="h-4 w-full bg-cocoa/10 rounded" />
               <div className="h-4 w-full bg-cocoa/10 rounded" />
               <div className="h-4 w-2/3 bg-cocoa/10 rounded" />
             </div>
          </div>

          {/* Visuals */}
          <div>
            <div className="h-4 w-24 bg-givry/30 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-lg border border-cocoa/10 bg-givry/20 aspect-video" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGiveawayDetail: React.FC = () => {
  return (
    <div className="pb-12 animate-pulse w-full">
      {/* Back Button */}
      <div className="mb-6 h-10 w-48 bg-givry/30 rounded-lg" />

      <div className="bg-givry border border-cocoa/20 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-64 md:h-80 w-full bg-cocoa/5 relative">
           <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-cocoa/20 rounded-full" />
                <div className="h-5 w-16 bg-cocoa/20 rounded-full" />
              </div>
              <div className="h-12 w-2/3 bg-cocoa/20 rounded-lg" />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-cocoa/10">
          {/* Content */}
          <div className="col-span-2 p-6 md:p-10 space-y-8">
             <div className="space-y-3">
               <div className="h-4 w-32 bg-cocoa/10 rounded mb-2" />
               <div className="h-4 w-full bg-cocoa/10 rounded" />
               <div className="h-4 w-full bg-cocoa/10 rounded" />
               <div className="h-4 w-2/3 bg-cocoa/10 rounded" />
             </div>
             
             <div className="space-y-4">
               <div className="h-4 w-32 bg-cocoa/10 rounded" />
               <div className="bg-white/50 p-6 rounded-xl border border-cocoa/10 h-48 bg-cocoa/5" />
             </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 p-6 md:p-10 flex flex-col gap-6 bg-cocoa/5 h-full min-h-[400px]">
             <div className="flex flex-col items-center gap-2 mb-4">
                <div className="h-4 w-24 bg-cocoa/10 rounded" />
                <div className="h-10 w-32 bg-cocoa/10 rounded" />
             </div>
             
             <div className="h-12 w-full bg-cocoa/10 rounded-lg" />
             <div className="h-10 w-full bg-cocoa/10 rounded-lg" />

             <div className="mt-auto space-y-4 pt-6 border-t border-cocoa/10">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex justify-between">
                       <div className="h-4 w-16 bg-cocoa/10 rounded" />
                       <div className="h-4 w-24 bg-cocoa/10 rounded" />
                    </div>
                 ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};