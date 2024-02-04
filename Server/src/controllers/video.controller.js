import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHander } from "../utils/asycHandler.js";
import { uploadOnCloudinary } from "../utils/Clodinary.js";

const getAllVideos = asyncHander(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pageNo = parseInt(page);
  const limitNo = parseInt(limit);

  const videos = await Video.aggregate([
    // Match stage for userId if provided
    userId
      ? {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
            isPublished: true,
          },
        }
      : {
          $match: {
            isPublished: true,
          },
        },

    // Search stage if query is provided

    query
      ? {
          $search: {
            index: "search-videos",
            text: {
              query,
              path: ["title", "description"],
            },
          },
        }
      : {},

    // Sorting stage
    sortBy && sortType
      ? {
          $sort: {
            [sortBy]: sortType === "asc" ? 1 : -1,
          },
        }
      : {
          $sort: { createdAt: -1 },
        },

    // Lookup owner details
    {
      $lookup: {
        from: "User",
        localField: "Owner",
        foreignField: "_id",
        as: "OwnerDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },

    // Unwind ownerDetails array
    {
      $unwind: $OwnerDetails,
    },

    // Pagination
    {
      $skip: (pageNo - 1) * limitNo,
    },

    {
      $limit: limitNo,
    },

    // Projecting fields
    {
      $project: {
        title: 1,
        description: 1,
        ownerDetails: 1,
        createdAt: 1,
        // Add other fields as needed
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHander(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fileds are required!");
  }

  const videoLocalPath = req.files.videFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if (!videoLocalPath) {
    throw new ApiError(400, "videoFile localpath is required!");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail localpath is required!");
  }

  //upload to cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  // Check if files are successfully uploaded
  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "Failed to upload videoFile or thumbnail!");
  }

  //create a new video in the database

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    owner: req.user?._id,
    isPublished: true,
  });

  // Retrieve the uploaded video from the database
  const uploadedVideo = await Video.findById(video._id);

  // Check if the video is successfully created
  if (!uploadedVideo) {
    throw new ApiError(500, "Failed to create the video!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully!"));
});

const getVideoById = asyncHander(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHander(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHander(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHander(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
