import mongoose, { Schema } from 'mongoose';
const EventSchema = new Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Event', EventSchema);
