import mongoose, { Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const clientSchema = new Schema(
  {
    // Public ID (This goes in the URL: ?client_id=...)
    clientId: {
      type: String,
      required: true,
      unique: true,
    },

    // Private Password (Used for exchange)
    clientSecret: {
      type: String,
      required: true,
    },

    // The name user sees: "Log in to APPa"
    appName: {
      type: String,
      required: true,
    },

    // The exact URLs this app is allowed to send users back to.
    allowedRedirectUris: [
      {
        type: String,
      },
    ],

    developerId: {
      type: "String",
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

export const Client = mongoose.models.clients || mongoose.model("clients", clientSchema);
