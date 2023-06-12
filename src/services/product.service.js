/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
import db from '../database/models';

const { Search, Cart, Product } = db;

const createSearchHistory = async (data) => Search.create(data);
const getSearchHistory = async (id) => Search.findOne({ where: { buyer_id: id } });
const updateSearchHistory = async (data, id) => Search.update(data, { where: { buyer_id: id } });
const getCartService = async (buyer_id) => Cart.findAll({ where: { buyer_id } });
const getAllProductsService = async () => Product.findAll({ where: { availability: true } });

const searchHistory = async (buyer_id, product) => {
  const searched = await getSearchHistory(buyer_id);
  if (product.length > 0) {
    const products = [product[0].id];
    searched && products.push(...searched.products);
    const data = { buyer_id, products };
    if (!searched) {
      await createSearchHistory(data);
    } else {
      await updateSearchHistory(data, buyer_id);
    }
  }
};
export {
  getSearchHistory, searchHistory, getCartService, getAllProductsService
};
