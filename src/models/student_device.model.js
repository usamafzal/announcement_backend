import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const studentDevice = ConfigDB.define(
  "StudentDevice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    platform: DataTypes.STRING,
  },
  {
    tableName: "student_device",
    timestamps: true,
  }
);
