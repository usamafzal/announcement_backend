import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const studentEnrollment = ConfigDB.define(
  "StudentEnrollment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    semesterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "students_enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "programId", "semesterId"],
      },
    ],
  }
);
