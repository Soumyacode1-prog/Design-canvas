import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import mongoose from "mongoose";

import { Canvas } from "../models/canvas.model.ts";

import {
  createCanvasSchema,
  updateCanvasSchema,
} from "../schemas/canvas.schema.ts";

export const createCanvas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      createCanvasSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid canvas data",
        errors: result.error.flatten(),
      });
    }

    const canvas = await Canvas.create(
      { ...result.data, owner: res.locals.userId }
    );

    return res.status(201).json(canvas);
  } catch (error) {
    next(error);
  }
};

export const getCanvases = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const canvases = await Canvas.find({ owner: res.locals.userId })
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json(canvases);
  } catch (error) {
    next(error);
  }
};

export const getCanvas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid canvas ID",
      });
    }

    const canvas = await Canvas.findOne({ _id: id, owner: res.locals.userId });

    if (!canvas) {
      return res.status(404).json({
        message: "Canvas not found",
      });
    }

    return res.status(200).json(canvas);
  } catch (error) {
    next(error);
  }
};

export const updateCanvas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid canvas ID",
      });
    }

    const result =
      updateCanvasSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid canvas data",
        errors: result.error.flatten(),
      });
    }

    const canvas =
      await Canvas.findOneAndUpdate(
        { _id: id, owner: res.locals.userId },
        result.data,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!canvas) {
      return res.status(404).json({
        message: "Canvas not found",
      });
    }

    return res.status(200).json(canvas);
  } catch (error) {
    next(error);
  }
};

export const deleteCanvas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid canvas ID",
      });
    }

    const canvas =
      await Canvas.findOneAndDelete({ _id: id, owner: res.locals.userId });

    if (!canvas) {
      return res.status(404).json({
        message: "Canvas not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};