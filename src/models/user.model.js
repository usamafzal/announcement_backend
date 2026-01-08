import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";
import bcrpt from "bcrypt";

export const UserModel = ConfigDB.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("username", value.toLowerCase());
      },
      validate: {
        len: {
          args: [5, 10],
          msg: "username between 5 to 10",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetOtp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    resetOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isOtpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      async beforeSave(user) {
        if (user.changed("password")) {
          const salt = await bcrpt.genSalt(10);
          const hash = await bcrpt.hash(user.password, salt);
          user.password = hash;
        }
      },
    },
  }
);
