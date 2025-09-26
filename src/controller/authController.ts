import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dynamo, PutCommand, GetCommand } from "../database/db";
import { UserModel } from "../models/User";

export const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    businessName,
    businessType,
    businessLocation,
    monthlyRevenue,
    employeeCount,
    alertPreference,
    hearAboutUs,
  } = req.body;

  // Basic validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !businessName ||
    !businessType ||
    !businessLocation ||
    !monthlyRevenue ||
    !employeeCount ||
    !alertPreference
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      businessName,
      businessType,
      businessLocation,
      monthlyRevenue,
      employeeCount,
      alertPreference,
      hearAboutUs
      
    });

    await dynamo.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: user,
        ConditionExpression: "attribute_not_exists(email)",
      })
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        businessType,
        businessLocation,
        monthlyRevenue,
        employeeCount,
        alertPreference,
        hearAboutUs,
      },
    });
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await dynamo.send(
      new GetCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: { email },
      })
    );

    const user = result.Item as UserModel | undefined;

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        businessType: user.businessType,
        businessLocation: user.businessLocation,
        monthlyRevenue: user.monthlyRevenue,
        employeeCount: user.employeeCount,
        alertPreference: user.alertPreference,
        hearAboutUs: user.hearAboutUs,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
