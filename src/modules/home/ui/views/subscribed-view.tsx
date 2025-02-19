import SubscribedVideoSection from '../sections/subscribed-videos-section';

export default function SubscribedView() {
   return (
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-4">
         <div>
            <h1 className="text-2xl font-bold">Subscribed</h1>
            <p className="text-xs text-muted-foreground">
               Videos from your fav creator
            </p>
         </div>

         <SubscribedVideoSection />
      </div>
   );
}
