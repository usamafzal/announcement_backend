import { programModel } from "../models/program.model.js";
import ApiResponse from "../utils/api_response/api_response.js";

const allPrograms = async (req, res) => {
  try {
    const allPrograms = await programModel.findAll();
    const response = new ApiResponse(200, "all programs", allPrograms);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to fetch programs: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const createProgram = async (req, res) => {
  try {
    const { name, durationSemesters } = req.body;
    if (!name || !durationSemesters) {
      const response = new ApiResponse(
        400,
        "name & durationSemesters is required"
      );
      return res.status(response.statusCode).json(response);
    }
    const existProgram = await programModel.findOne({ where: { name } });

    if (existProgram) {
      const response = new ApiResponse(409, "already programe exist");
      return res.status(response.statusCode).json(response);
    }

    const createProgram = await programModel.create({
      name,
      durationSemesters,
    });

    const response = new ApiResponse(
      201,
      "program created successfully",
      createProgram
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const errmsg = new ApiResponse(
      500,
      `failed to create program: ${error.message}`
    );
    return res.status(errmsg.statusCode).json(errmsg);
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      const response = new ApiResponse(400, "id can't empty");
      return res.status(response.statusCode).json(response);
    }

    const existProgram = await programModel.findByPk(id);

    if (!existProgram) {
      const response = new ApiResponse(404, "program can't exist");
      return res.status(response.statusCode).json(response);
    }

    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { name, durationSemesters } = req.body;
    if (!name) {
      const response = new ApiResponse(409, "name is required");
      return res.status(response.statusCode).json(response);
    }

    const programExist = await programModel.findOne({ where: { name } });

    if (programExist) {
      const response = new ApiResponse(409, "program name already exist ");
      return res.status(response.statusCode).json(response);
    }
    const [_, updated] = await programModel.update(
      { name, durationSemesters },
      { where: { id: existProgram.id }, returning: true }
    );

    const response = new ApiResponse(
      200,
      "program updated successfully",
      updated[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to update program: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const existProgram = await programModel.findByPk(id);
    if (!existProgram) {
      const response = new ApiResponse(200, "Program can't exist");
      return res.status(response.statusCode).json(response);
    }
    await programModel.destroy({ where: { id: existProgram.id } });

    const response = new ApiResponse(200, "program deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to delete program: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export { createProgram, updateProgram, deleteProgram, allPrograms };
