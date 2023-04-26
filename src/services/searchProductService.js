import db from '../database/models';

const { Product, User, Category } = db;
const searchInProduct = async (Query) => {
  const product = await Product.findAll({
    include: [
      {
        model: User,
        attributes: ['firstname', 'lastname', 'email']
      },
      {
        model: Category,
        attributes: ['categoryName']
      }],
    where: Query
  });
  const result = product.length > 0 ? product : { message: 'No product found' };
  return result;
};
const searchInCategory = async (Query) => {
  const product = await Category.findAll({
    include: [
      {
        model: Product,
        include: [{
          model: User,
          attributes: ['firstname', 'lastname', 'email'],
        }]
      }],
    where: Query
  });
  const result = product.length > 0 ? product : { message: 'No products found' };
  return result;
};
export { searchInProduct, searchInCategory };
