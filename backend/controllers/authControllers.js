import User from '../models/user';
import ErrorHandler from '../utils/errorHandler';
import APIFilters from '../utils/APIFilters';
import {
  totalUsersThatBoughtPipeline,
  totalUsersThatBoughtThisMonthPipeline,
  usersRegisteredPerMonthPipeline,
  usersThatBoughtMostThisMonthPipeline,
  userThatBoughtMostSinceBeginningPipeline,
} from '../pipelines/userPipelines';
import Order from '../models/order';
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
  const resPerPage = 2;
  // Total Number of Users (Admin and Client)
  const usersCount = await User.countDocuments();

  const apiFilters = new APIFilters(User.find(), req.query).search().filter();

  let users = await apiFilters.query.sort({ createdAt: -1 });
  const filteredUsers = users?.length;
  apiFilters.pagination(resPerPage);
  users = await apiFilters.query.clone().sort({ createdAt: -1 });

  const result = filteredUsers / resPerPage;
  const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

  /////////************ ************/////////

  ////////*** STATS AND PIPELINES ***////////

  /////////************ ************/////////

  // GETTING LAST MONTH INDEX, CURRENT MONTH and CURRENT YEAR
  const lastMonth = new Date().getMonth();
  const currentMonth = lastMonth + 1;
  const currentYear = new Date().getFullYear();

  // Total Number of Client Users
  const clientUsersCount = await User.countDocuments({ role: 'user' });

  // Total Number of Client Registered this Month and this Year
  const usersRegisteredThisMonth = await usersRegisteredPerMonthPipeline(
    currentMonth,
    currentYear,
  );

  // Total Number of Client Registered Last Month and this Year
  const usersRegisteredLastMonth = await usersRegisteredPerMonthPipeline(
    lastMonth,
    currentYear,
  );

  res.status(200).json({
    usersRegisteredLastMonth,
    usersRegisteredThisMonth,
    clientUsersCount,
    totalPages,
    usersCount,
    filteredUsers,
    users,
  });
};

export const getUser = async (req, res) => {
  let user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('No user found', 404));
  }

  const orders = await Order.find({
    user: new mongoose.Types.ObjectId(user?._id),
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    user,
    orders,
  });
};

export const updateUser = async (req, res) => {
  let user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('No user found', 404));
  }

  user = await User.findByIdAndUpdate(req.query.id, req.body.userData);

  res.status(200).json({
    success: true,
    user,
  });
};

export const deleteUser = async (req, res) => {
  let user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('No User found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
};

export const getPurchasingsStats = async (req, res) => {
  // GETTING CURRENT MONTH and CURRENT YEAR
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalUsersThatBought = await totalUsersThatBoughtPipeline();

  const totalUsersThatBoughtThisMonth =
    await totalUsersThatBoughtThisMonthPipeline(currentMonth, currentYear);

  const userThatBoughtMostSinceBeginning =
    await userThatBoughtMostSinceBeginningPipeline();

  const usersThatBoughtMostThisMonth =
    await usersThatBoughtMostThisMonthPipeline(currentMonth, currentYear);

  res.status(200).json({
    totalUsersThatBought,
    totalUsersThatBoughtThisMonth,
    userThatBoughtMostSinceBeginning,
    usersThatBoughtMostThisMonth,
  });
};
