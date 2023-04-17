import {
  ByNameAndDescription, searchBYCategory, searchByDescription, searchByName, searchByPrice
} from '../helpers/QueryHelper';

const searchProductByName = async (name, userRole, user) => {
  const result = await searchByName(name, userRole, user);

  if (!result || result.length === 0) {
    return { message: 'No product found' };
  }
  return result;
};
const searchProductByNameAndDescritption = async (name, description, userRole, user) => {
  const result = await ByNameAndDescription(name, description, userRole, user);

  if (!result || result.length === 0) {
    return { message: 'No product found' };
  }
  return result;
};

const searchProductByPrice = async (minPrice, maxPrice, userRole, user) => {
  const result = await searchByPrice(minPrice, maxPrice, userRole, user);

  if (!result || result.length === 0) {
    return { message: 'No product found' };
  }
  return result;
};

const searchProductByCategory = async (category, userRole) => {
  const result = await searchBYCategory(category, userRole);

  if (!result || result.length === 0) {
    return { message: 'No product found' };
  }
  return result;
};
const searchProductByDescription = async (description, userRole, user) => {
  const result = await searchByDescription(description, userRole, user);
  if (!result || result.length === 0) {
    return { message: 'No product found' };
  }
  return result;
};
export {
  searchProductByName, searchProductByPrice, searchProductByCategory,
  searchProductByNameAndDescritption, searchProductByDescription
};
