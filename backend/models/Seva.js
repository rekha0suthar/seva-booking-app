import { Schema, model } from 'mongoose';

const sevaSchema = new Schema({
  code: String,
  title: String,
  tags: [String],
  description: String,
  marketPrice: Number,
  discountedPrice: Number,
  start: String,
  end: String,
  amountRaised: Number,
  targetAmount: Number,
  media: String,
});

const Seva = model('Seva', sevaSchema);

export default Seva;
