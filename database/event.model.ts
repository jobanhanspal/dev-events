import mongoose, { Document, Schema, Model, CallbackError } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IEventModel extends Model<IEvent> {
  generateSlug(title: string): string;
}

const eventSchema = new Schema<IEvent, IEventModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      minlength: [10, "Overview must be at least 10 characters"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
      lowercase: true,
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Generate a URL-friendly slug from the title.
 * Lowercases, removes special chars, replaces spaces with hyphens,
 * and trims leading/trailing hyphens.
 */
eventSchema.statics.generateSlug = function (title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/**
 * Pre-save hook to:
 * 1. Auto-generate slug from title (only if title changed or slug missing)
 * 2. Normalize date to ISO format (YYYY-MM-DD)
 * 3. Normalize time to HH:MM 24-hour format
 * 4. Validate required fields are non-empty
 */
eventSchema.pre("save", async function (
  this: IEvent,
  next: (err?: CallbackError) => void
) {
  // Validate required string fields are non-empty
  const requiredFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredFields) {
    const value = this[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return next(new Error(`${field} is required and cannot be empty`));
    }
  }

  // Validate arrays have content
  if (!this.agenda || this.agenda.length === 0) {
    return next(new Error("Agenda must contain at least one item"));
  }
  if (!this.tags || this.tags.length === 0) {
    return next(new Error("At least one tag is required"));
  }

  // Generate slug if title is modified or slug is missing
  if (this.isModified("title") || !this.slug) {
    const baseSlug = (this.constructor as IEventModel).generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    const EventModel = this.constructor as IEventModel;
    while (await EventModel.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  const parsedDate = new Date(this.date);
  if (isNaN(parsedDate.getTime())) {
    return next(new Error("Invalid date format"));
  }
  this.date = parsedDate.toISOString().split("T")[0];

  // Normalize time to HH:MM 24-hour format
  const timeMatch = this.time.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const period = timeMatch[3]?.toLowerCase();

    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    this.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
  } else {
    // Try parsing as 24-hour format
    const parsedTime = new Date(`1970-01-01T${this.time}`);
    if (isNaN(parsedTime.getTime())) {
      return next(new Error("Invalid time format. Use HH:MM or HH:MM AM/PM"));
    }
    this.time = parsedTime.toTimeString().slice(0, 5);
  }

  next();
});

// Unique index on slug (also defined in schema, but explicit for clarity)
eventSchema.index({ slug: 1 }, { unique: true });

const Event = mongoose.model<IEvent, IEventModel>("Event", eventSchema);

export default Event;