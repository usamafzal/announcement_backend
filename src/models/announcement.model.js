import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const announcementModel = ConfigDB.define(
  "Announcement",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
  }
);
