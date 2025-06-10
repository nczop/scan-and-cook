import { supabase } from './supabase';

export interface Recipe {
  title: string;
  category_id: number;
  instructions: string;
  // ingredients: { name: string; amount: string }[];
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRecipes() {
  const { data, error } = await supabase.from('recipes').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllRecipeNames() {
  const { data, error } = await supabase.from('recipes').select('title');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRecipeByTitle(title: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('title', title);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addRecipe(recipe: Recipe) {
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteRecipe(title: string) {
  const { error } = await supabase.from('recipes').delete().eq('title', title);

  if (error) {
    throw new Error(error.message);
  }
}
