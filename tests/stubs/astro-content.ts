// Stand-in for the virtual `astro:content` module so lib code that imports it
// can be loaded under Vitest. Tests that need data mock getCollection.
export const getCollection = async (_name: string): Promise<unknown[]> => [];
export const render = async () => ({ Content: () => null });
