import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Please enter your category name'],
  },
});

export default mongoose.models.Category ||
  mongoose.model('Category', categorySchema);
