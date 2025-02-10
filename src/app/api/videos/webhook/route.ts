import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import {
   VideoAssetCreatedWebhookEvent,
   VideoAssetDeletedWebhookEvent,
   VideoAssetErroredWebhookEvent,
   VideoAssetReadyWebhookEvent,
   VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { UTApi } from 'uploadthing/server';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent =
   | VideoAssetCreatedWebhookEvent
   | VideoAssetErroredWebhookEvent
   | VideoAssetReadyWebhookEvent
   | VideoAssetTrackReadyWebhookEvent
   | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
   if (!SIGNING_SECRET) {
      throw new Error('MUX_WEBHOOK_SECRET is not set');
   }

   const headersPayload = await headers();
   const muxSignature = headersPayload.get('mux-signature');

   if (!muxSignature) {
      return new Response('No signature found', { status: 401 });
   }

   const payload = await request.json();
   const body = JSON.stringify(payload);

   mux.webhooks.verifySignature(
      body,
      {
         'mux-signature': muxSignature,
      },
      SIGNING_SECRET,
   );

   switch (payload.type as WebhookEvent['type']) {
      case 'video.asset.created': {
         const data = payload.data as VideoAssetCreatedWebhookEvent['data'];
         if (!data.upload_id) {
            return new Response('No upload Id found', { status: 400 });
         }

         console.log('creating video : ', data.upload_id);
         await db
            .update(videos)
            .set({
               muxAssetsId: data.id,
               muxStatus: data.status,
            })
            .where(eq(videos.muxUploadId, data.upload_id));

         break;
      }

      case 'video.asset.ready': {
         const data = payload.data as VideoAssetReadyWebhookEvent['data'];
         if (!data.upload_id)
            return new Response('Missing upload Id', { status: 400 });

         const playbackId = data.playback_ids?.[0].id;
         if (!playbackId)
            return new Response('Missing playback Id', { status: 400 });

         const tempThumbnailUrl = `https:///image.mux.com/${playbackId}/thumbnail.jpg`;
         const tempPreviewUrl = `https:///image.mux.com/${playbackId}/animated.gif`;
         const duration = data.duration ? Math.round(data.duration * 1000) : 0;

         const utapi = new UTApi();
         const [uploadedThumbnail, uploadedProview] =
            await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

         if (!uploadedThumbnail.data || !uploadedProview.data) {
            return new Response('Failed to upload thumbnail or preview', {
               status: 500,
            });
         }

         const { key: thumbnailKey, url: thumbnailUrl } =
            uploadedThumbnail.data;
         const { key: previewKey, url: previewUrl } = uploadedProview.data;

         console.log('ready video : ', data.upload_id);
         await db
            .update(videos)
            .set({
               muxStatus: data.status,
               muxPlaybackId: playbackId,
               muxAssetsId: data.id,
               thumbnailUrl,
               previewUrl,
               thumbnailKey,
               previewKey,
               duration,
            })
            .where(eq(videos.muxUploadId, data.upload_id));

         break;
      }

      case 'video.asset.errored': {
         const data = payload.data as VideoAssetErroredWebhookEvent['data'];

         if (!data.upload_id)
            return new Response('Missing upload Id', { status: 400 });

         await db
            .update(videos)
            .set({
               muxStatus: data.status,
            })
            .where(eq(videos.muxUploadId, data.upload_id));

         break;
      }

      case 'video.asset.deleted': {
         const data = payload.data as VideoAssetDeletedWebhookEvent['data'];

         if (!data.upload_id)
            return new Response('Missing upload Id', { status: 400 });

         console.log('deleting video : ', data.upload_id);

         await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

         break;
      }

      case 'video.asset.track.ready': {
         const data =
            payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
               asset_id: string;
            }; // assets_id exists but ts doesn't know i.e, adding this here

         if (!data.asset_id)
            return new Response('Missing upload Id', { status: 400 });

         console.log('track ready');

         await db
            .update(videos)
            .set({
               muxTrackId: data.id,
               muxTrackStatus: data.status,
            })
            .where(eq(videos.muxAssetsId, data.asset_id));

         break;
      }
   }

   return new Response('Webhook received', { status: 200 });
};
