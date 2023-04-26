import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../database/models';
import tokenDecode from '../helpers/token_decode';

dotenv.config();
const { Review } = db;
const { User } = db;
const { OrderItem } = db;
const { Order } = db;

export const AddReview = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

  const review = {
    product_id: req.params.id,
    buyer_id: decodedData.payload.id,
    ratings: req.body.ratings,
    feedback: req.body.feedback
  };

  const existing_review = await Review.findOne({
    where: {
      product_id: req.params.id,
      buyer_id: decodedData.payload.id
    }
  });

  try {
    if (existing_review) {
      res.json({ message: 'You have already reviewed the product' });
    }
    if (!existing_review) {
      const product = await OrderItem.findOne({
        where: {
          product_id: req.params.id,
          status: 'approved'
        }
      });
      if (product) {
        const successfulOrder = await Order.findAll({
          where: {
            id: product.order_id,
            status: 'successfull'
          }
        });
        if (successfulOrder) {
          const review_added = await Review.create(review);
          res.json({ message: 'Successfully Added Review', review: review_added });
        } else {
          res.status(406).json({ message: 'You can add a review only when your order succeeded' });
        }
      } else {
        res
          .status(406)
          .json({ message: 'You can add a review only when the item you ordered was approved' });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
export const getReviews = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);
  try {
    const { id } = req.params;
    const reviews = await Review.findAll({
      where: {
        product_id: id
      }
    });
    res.json({ reviews });
  } catch (error) {
    res.json({ message: error.message });
  }
};
export const deleteReview = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        buyer_id: decodedData.payload.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateReview = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

  const review = {
    ratings: req.body.ratings,
    feedback: req.body.feedback
  };

  try {
    const existingReview = await Review.findOne({
      where: {
        id: req.params.id,
        buyer_id: decodedData.payload.id
      }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await existingReview.update(review);

    return res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
