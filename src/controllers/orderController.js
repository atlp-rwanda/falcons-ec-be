import db from '../database/models/index';

const { OrderItem } = db;

const getOrderItems = async (req, res) => {
  try {
    const sellerID = req.user.id;
    const sellerItems = await OrderItem.findAll({
      where: { seller_id: sellerID },
    });
    if (sellerItems.length > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        data: sellerItems,
      });
    }
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'No order items found',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to get order items',
      error: error.message,
    });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const sellerID = req.user.id;
    const itemId = req.params.id;
    const itemFound = await OrderItem.findOne({ where: { id: itemId } });
    const foundItemSeller = itemFound.seller_id;
    if (foundItemSeller !== sellerID) {
      return res
        .status(401)
        .json({ status: 401, success: false, message: 'Unauthorised' });
    }
    itemFound.status = req.body.status;
    const updatedStatus = await itemFound.save();
    return res.status(201).json({
      status: 201,
      success: true,
      data: updatedStatus.status,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to update order items status',
      error: error.message,
    });
  }
};

export default getOrderItems;
