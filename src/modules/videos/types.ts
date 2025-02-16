import { AppRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type VideoGetOneOutput =
   inferRouterOutputs<AppRouter>['videos']['getOne'];

// todo change to videos
export type VideoGetManyOutput =
   inferRouterOutputs<AppRouter>['suggestions']['getMany'];
