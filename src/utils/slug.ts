export const createSlug = (text: any) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export async function generateUniqueSlug(baseSlug: string, model: any, counter = 0) {
  let newSlug = baseSlug;
  if (counter > 0) {
    newSlug = `${baseSlug}-${counter}`;
  }

  const existingItem = await model.findOne({ slug: newSlug });
  if (!existingItem) {
    return newSlug;
  }

  return generateUniqueSlug(baseSlug, model, counter + 1);
}
