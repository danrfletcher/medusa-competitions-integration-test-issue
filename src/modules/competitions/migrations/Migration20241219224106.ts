import { Migration } from '@mikro-orm/migrations';

export class Migration20241219224106 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "geoguesser_guess" ("id" text not null, "order_item_id" text not null, "map_coordinates" text[] not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "geoguesser_guess_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geoguesser_guess_deleted_at" ON "geoguesser_guess" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "geoguesser_image" ("id" text not null, "image_id" text not null, "product_variant_id" text not null, "map_coordinates" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "geoguesser_image_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geoguesser_image_deleted_at" ON "geoguesser_image" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "geoguesser_guess" cascade;');

    this.addSql('drop table if exists "geoguesser_image" cascade;');
  }

}
