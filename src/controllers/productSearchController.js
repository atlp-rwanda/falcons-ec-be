import {
  searchProductByName, searchProductByPrice,
  searchProductByCategory, searchProductByNameAndDescritption, searchProductByDescription
} from '../services/productSearchService';
import getUserRoles from '../services/user.service';

const searchProduct = async (req, res) => {
  try {
    const {
      name, minPrice, maxPrice, description, category
    } = req.query;
    const { id } = req.user;
    const userRole = await getUserRoles(id);
    if (name && description) {
      const product = await searchProductByNameAndDescritption(name, description, userRole, id);
      return res.status(200).json(product);
    }

    if (name) {
      const product = await searchProductByName(name, userRole, id);
      return res.status(200).json(product);
    }

    if (minPrice && maxPrice) {
      const product = await searchProductByPrice(minPrice, maxPrice, userRole, id);
      return res.status(200).json(product);
    }

    if (category) {
      const product = await searchProductByCategory(category, userRole);
      return res.status(200).json(product);
    } if (description) {
      const product = await searchProductByDescription(description, userRole, id);
      return res.status(200).json(product);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default searchProduct;
