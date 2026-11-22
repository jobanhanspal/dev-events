import mongoose, { Document, Schema, Model, Types, CallbackError } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBookingModel extends Model<IBooking> {}

const bookingSchema = new Schema<IBooking, IBookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre-save hook to validate that the referenced event exists.
 * This ensures data integrity by preventing bookings for non-existent events.
 */
bookingSchema.pre("save", async function (
  this: IBooking,
  next: (err?: CallbackError) => void
) {
  try {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      return next(new Error("Referenced event does not exist"));
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Failed to validate event reference"));
    }
  }
});

// Index on eventId for faster queries (also defined in schema, but explicit for clarity)
bookingSchema.index({ eventId: 1 });

const Booking = mongoose.model<IBooking, IBookingModel>("Booking", bookingSchema);

export default Booking;