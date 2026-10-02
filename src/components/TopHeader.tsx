import React from 'react';

export const TopHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 via-purple-600 to-indigo-600 p-[2px] shadow-lg">
      <div className="bg-slate-950/90 backdrop-blur-md py-1.5 px-4 text-center border-b border-white/10 flex justify-center items-center">
        <h2 className="text-amber-200 font-serif text-sm md:text-base font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
      </div>
    </div>
  );
};
