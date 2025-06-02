import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/app-layout.tsx', [
    index('routes/home.tsx'),
    route('recipes', 'routes/recipes.tsx'),
    route('recipes/:title', 'routes/recipe.tsx'),
    route('add-recipe', 'routes/add-recipe/recipe-upload-options.tsx'),
    route(
      'add-recipe/upload-photo',
      'routes/add-recipe/upload-photo/upload-photo.tsx',
    ),
    route(
      'add-recipe/scan-photo',
      'routes/add-recipe/scan-photo/scan-photo.tsx',
    ),
    route(
      'add-recipe/add-recipe-form',
      'routes/add-recipe/add-recipe-form/add-recipe-form.tsx',
    ),
  ]),
] satisfies RouteConfig;
