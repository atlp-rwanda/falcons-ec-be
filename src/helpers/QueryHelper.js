import { Op } from 'sequelize';
import db from '../database/models';

const { Product, Category, User } = db;

const searchByName = async (name, userRole, user) => {
  name = name.trim();
  if (userRole === 'buyer' || userRole === 'admin') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: ['categoryName']
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: { productName: { [Op.iLike]: `%${name}%` } }
    });
    return result;
  }

  if (userRole === 'seller') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id', 'category_id'] },
      include: [
        {
          model: Category,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: {
        [Op.and]: [
          {
            productName: { [Op.iLike]: `%${name}%` }
          },
          {
            seller_id: user
          }
        ]
      }
    });
    return result;
  }
};

const searchByPrice = async (minPrice, maxPrice, userRole, user) => {
  minPrice = minPrice.trim();
  maxPrice = maxPrice.trim();
  if (userRole === 'buyer' || userRole === 'admin') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],
      where: { price: { [Op.between]: [minPrice, maxPrice] } }
    });
    return result;
  }
  if (userRole === 'seller') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: {
        [Op.and]: [
          { price: { [Op.between]: [minPrice, maxPrice] } },
          {
            seller_id: user
          }
        ]
      }
    });
    return result;
  }
};

const ByNameAndDescription = async (name, description, userRole, user) => {
  name = name.trim();
  description = description.trim();
  if (userRole === 'buyer' || userRole === 'admin') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: ['categoryName']
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],
      where: {
        [Op.and]: [
          {
            description: { [Op.iLike]: `%${description}%` }
          },
          {
            productName: { [Op.iLike]: `%${name}%` }

          },
        ],
      },
    });
    return result;
  }
  if (userRole === 'seller') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: ['categoryName']
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: {
        [Op.and]: [
          {
            description: { [Op.iLike]: `%${description}%` }
          },
          {
            productName: { [Op.iLike]: `%${name}%` }

          },
          {
            seller_id: user
          }
        ]
      }
    });
    return result;
  }
};

const searchBYCategory = async (category, userRole) => {
  category = category.trim();
  if (userRole === 'buyer' || userRole === 'admin') {
    const result = await Category.findAll({
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Product,
          attributes: { exclude: ['seller_id', 'category_id'] }
        }
      ],
      where: {
        categoryName: { [Op.iLike]: `%${category}%` }
      },
    });
    return result;
  }
};
const searchByDescription = async (description, userRole, user) => {
  description = description.trim();
  if (userRole === 'buyer' || userRole === 'admin') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id'] },
      include: [
        {
          model: Category,
          attributes: [['categoryName', 'category']]
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: { description: { [Op.iLike]: `%${description}%` } }
    });
    return result;
  }

  if (userRole === 'seller') {
    const result = await Product.findAll({
      attributes: { exclude: ['seller_id', 'category_id'] },
      include: [
        {
          model: Category,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
        {
          model: User,
          attributes: ['firstname', 'lastname', 'email', 'gender']
        }
      ],

      where: {
        [Op.and]: [
          {
            description: { [Op.iLike]: `%${description}%` }
          },
          {
            seller_id: user
          }
        ]
      }
    });
    return result;
  }
};

export {
  searchByName, searchByPrice, ByNameAndDescription, searchBYCategory,
  searchByDescription

};
