import db from '../database/models/index';

const { ProductWishlist } = db;

const createProductWishes = async (productWishes) => {
  await ProductWishlist.create(productWishes);
};

export default createProductWishes;
