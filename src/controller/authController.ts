import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dynamo, PutCommand, GetCommand } from "../database/db";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    console.log("Attempting to register user:", { username, email });
    console.log("Environment variables:", {
      tableName: process.env.DYNAMODB_TABLE_NAME,
      region: process.env.AWS_REGION,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Use email as primary key (pk) for the DynamoDB table
    await dynamo.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          pk: email, // Using email as primary key
          username,
          email,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(pk)", // Check if user doesn't already exist
      })
    );

    console.log("User registered successfully:", email);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        username,
        email,
      },
    });
  } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.name === "ConditionalCheckFailedException") {
        return res.status(409).json({ message: "User already exists" });
      }
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
