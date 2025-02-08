import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryName = [
   'cars and vehicles',
   'comedy',
   'education',
   'gaming',
   'entertainment',
   'film and animation',
   'how to',
   'music',
   'science',
   'sports',
   'travel & vlogs',
];

async function main() {
   console.log('seeding categories');

   try {
      const values = categoryName.map((name) => ({
         name,
         description: `videos related to ${name}`,
      }));
      await db.insert(categories).values(values);

      console.log('categories seeded successfully');
   } catch (error) {
      console.error('error seeding categories: ', error);
   }
}

main();
