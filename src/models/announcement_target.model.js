import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const announcementTarget = ConfigDB.define(
  "AnnouncementTarget",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    announcementId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    programId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    semesterId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "announcement_target",
    timestamps: true,
    indexes: [
      {
        fields: ["announcementId"],
      },
    ],
  }
);
