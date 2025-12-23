import { groq } from 'next-sanity';
import { client } from './client';

// Get all projects ordered by display order
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    categories,
    "image": image.asset->url,
    description,
    tech,
    link,
    github,
    order
  }
`;

// Get projects by category
export const projectsByCategoryQuery = groq`
  *[_type == "project" && $category in categories] | order(order asc) {
    _id,
    title,
    categories,
    "image": image.asset->url,
    description,
    tech,
    link,
    github,
    order
  }
`;

// Get single project by ID
export const projectByIdQuery = groq`
  *[_type == "project" && _id == $id][0] {
    _id,
    title,
    categories,
    "image": image.asset->url,
    description,
    tech,
    link,
    github,
    order
  }
`;

export { client };
