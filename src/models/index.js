import { announcementModel } from "./announcement.model.js";
import { announcementTarget } from "./announcement_target.model.js";
import applyAssociations from "./associations.js";
import { classModel } from "./class.model.js";
import { programModel } from "./program.model.js";
import { semesterModel } from "./semester.model.js";
import { studentModel } from "./student.model.js";
import { studentDevice } from "./student_device.model.js";
import { studentEnrollment } from "./student_enrollment.model.js";
import { UserModel } from "./user.model.js";

const models = {
  studentModel,
  classModel,
  semesterModel,
  announcementModel,
  announcementTarget,
  programModel,
  studentEnrollment,
  studentDevice,
  UserModel,
};

applyAssociations(models);

export default models;
