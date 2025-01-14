import mongoose from 'mongoose';

const paymentTypeSchema = new mongoose.Schema({
  paymentName: {
    type: String,
    required: [true, 'Please enter your platform name'],
  },
  paymentNumber: {
    type: String,
    required: [true, 'Please enter your platform number'],
  },
});

export default mongoose.models.PaymentType ||
  mongoose.model('PaymentType', paymentTypeSchema);
