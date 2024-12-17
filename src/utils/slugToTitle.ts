export const convertSlugToTitle = (slug: string) => {
    return slug
      .split('_') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' '); 
  }