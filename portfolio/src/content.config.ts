import { defineCollection } from 'astro:content';
import { caseFileLoader } from './lib/caseFileLoader';

// Only files listed in src/data/published.json are loaded.
const caseFiles = defineCollection({ loader: caseFileLoader() });

export const collections = { caseFiles };
