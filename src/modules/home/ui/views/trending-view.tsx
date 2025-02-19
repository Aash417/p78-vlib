import TrendingVideoSection from '../sections/trending-videos-section';

export default function TrendngView() {
   return (
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-4">
         <div>
            <h1 className="text-2xl font-bold">Trending</h1>
            <p className="text-xs text-muted-foreground">
               Most popular videos at the moment
            </p>
         </div>

         <TrendingVideoSection />
      </div>
   );
}
