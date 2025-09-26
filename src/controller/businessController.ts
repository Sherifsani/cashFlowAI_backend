import { Request, Response } from "express";
import { Business } from "../models/Business";
import { v4 as uuidv4 } from "uuid";
import { dynamo, PutCommand } from "../database/db";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const createBusiness = async (req: Request, res: Response) => {
  const {
    ownerEmail,
    businessName,
    businessType,
    location,
    startingBalance,
    monthlyRevenue,
    monthlyExpenses,
    primaryGoal,
    targetGrowth,
    phone,
    whatsappAlerts,
    emailReports,
  } = req.body;

  if (
    !ownerEmail ||
    !businessName ||
    !businessType ||
    !location ||
    !startingBalance ||
    !monthlyRevenue ||
    !monthlyExpenses ||
    !primaryGoal ||
    !targetGrowth ||
    !phone
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const business: Business = {
    businessId: uuidv4(),
    ownerEmail,
    businessName,
    businessType,
    location,
    startingBalance,
    monthlyRevenue,
    monthlyExpenses,
    primaryGoal,
    targetGrowth,
    phone,
    whatsappAlerts,
    emailReports,
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamo.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_BUSINESS_TABLE as string,
        Item: business,
      })
    );
    res.status(201).json({ message: "Business account created", business });
  } catch (error) {
    console.error(error); // Add this line
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBusinessesByUser = async (req: Request, res: Response) => {
  const { ownerEmail } = req.query;
  if (!ownerEmail) {
    return res.status(400).json({ message: "ownerEmail is required" });
  }
  try {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: process.env.DYNAMODB_BUSINESS_TABLE as string,
        IndexName: "ownerEmail-index", // You need a GSI on ownerEmail
        KeyConditionExpression: "ownerEmail = :email",
        ExpressionAttributeValues: { ":email": ownerEmail },
      })
    ) as import("@aws-sdk/lib-dynamodb").QueryCommandOutput;
    res.json({ businesses: result.Items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};