import { supabase } from './supabase';

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
