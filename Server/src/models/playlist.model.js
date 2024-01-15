import mongoose, { Schema } from "mongoose";

const playlistschema = new Schema(
  {
    name: {
      type: String,
      reuired: true,
    },
    description: {
      type: String,
      reuired: true,
    },

    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model("Playlist", playlistschema);
