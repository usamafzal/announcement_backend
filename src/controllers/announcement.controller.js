import { announcementModel } from "../models/announcement.model.js";
import ApiResponse from "../utils/api_response/api_response.js";

const allAnnouncement = async (req, res) => {
  try {
    const announcements = await announcementModel.findAll();
    const response = new ApiResponse(200, `all announcements`, announcements);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `all announcements: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const createAnnouncement = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { title, message } = req.body;

    if (!title || !message) {
      const response = new ApiResponse(409, "title & message is required");
      return res.status(response.statusCode).json(response);
    }

    const createAnnouncement = await announcementModel.create({
      title,
      message,
    });

    const response = new ApiResponse(
      201,
      "Announcement created successfully",
      createAnnouncement
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to create announcement: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await announcementModel.findByPk(id);

    if (!existed) {
      const response = new ApiResponse(404, "announcement not found");
      return res.status(response.statusCode).json(response);
    }

    if (!req.body) {
      const response = new ApiResponse(409, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { title, message } = req.body;

    const [_, updatedRecord] = await announcementModel.update(
      { title, message },
      { where: { id }, returning: true }
    );

    const response = new ApiResponse(
      200,
      "announcement updated successfully",
      updatedRecord[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to update announcement: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const existed = await announcementModel.findByPk(id);
    if (!existed) {
      const response = new ApiResponse(404, "announcement not found");
      return res.status(response.statusCode).json(response);
    }
    await announcementModel.destroy({ where: { id } });
    const response = new ApiResponse(200, "announcement deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to delete announcement: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export {
  allAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
