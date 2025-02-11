import { relations } from 'drizzle-orm';
import {
   integer,
   pgEnum,
   pgTable,
   primaryKey,
   text,
   timestamp,
   uniqueIndex,
   uuid,
} from 'drizzle-orm/pg-core';
import {
   createInsertSchema,
   createSelectSchema,
   createUpdateSchema,
} from 'drizzle-zod';

export const users = pgTable(
   'users',
   {
      id: uuid('id').primaryKey().defaultRandom(),
      clerkId: text('clerk_id').unique().notNull(),
      name: text('name').notNull(),
      //todo add banner field
      imageUrl: text('image_url').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull(),
   },
   (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)],
);

export const categories = pgTable(
   'categories',
   {
      id: uuid('id').primaryKey().defaultRandom(),
      name: text('name').notNull().unique(),
      description: text('description'),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull(),
   },
   (t) => [uniqueIndex('name_idx').on(t.name)],
);

export const videoVisibility = pgEnum('videoVisibility', ['private', 'public']);

export const videos = pgTable('videos', {
   id: uuid('id').primaryKey().defaultRandom(),
   title: text('title').notNull(),
   description: text('description'),
   muxStatus: text('mux_status'),
   muxAssetsId: text('mux_asset_id').unique(),
   muxUploadId: text('mux_upload_id').unique(),
   muxPlaybackId: text('mux_playback_id').unique(),
   muxTrackId: text('mux_track_id').unique(),
   muxTrackStatus: text('mux_status_id').unique(),
   thumbnailUrl: text('thumbnail_url'),
   thumbnailKey: text('thumbnail_key'),
   previewUrl: text('preview_url'),
   previewKey: text('preview_key'),
   duration: integer('duration').default(0).notNull(),
   visibility: videoVisibility('visibility').default('private').notNull(),
   userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
   categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
   }),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const VideoRelations = relations(videos, ({ one, many }) => ({
   user: one(users, {
      fields: [videos.userId],
      references: [users.id],
   }),
   category: one(categories, {
      fields: [videos.categoryId],
      references: [categories.id],
   }),
   views: many(videoViews),
}));

export const UserRelations = relations(users, ({ many }) => ({
   videos: many(videos),
   videoViews: many(videoViews),
}));

export const CategoryRelations = relations(users, ({ many }) => ({
   videos: many(videos),
}));

export const videoViews = pgTable(
   'video_views',
   {
      userId: uuid('user_id')
         .references(() => users.id, { onDelete: 'cascade' })
         .notNull(),
      videoId: uuid('video_id')
         .references(() => videos.id, {
            onDelete: 'cascade',
         })
         .notNull(),

      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull(),
   },
   (t) => [
      primaryKey({
         name: 'video_views_pk',
         columns: [t.userId, t.videoId],
      }),
   ],
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
   users: one(users, {
      fields: [videoViews.userId],
      references: [users.id],
   }),
   videos: one(videos, {
      fields: [videoViews.videoId],
      references: [videos.id],
   }),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdatechema = createUpdateSchema(videoViews);
