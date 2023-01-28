import { Request, Response, NextFunction } from "express";
import { lists } from "./database";
import { iData } from "./interfaces";

export const searchForList = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const id = Number(request.params.id);
  const index = lists.findIndex((list) => list.id === id);

  if (index === -1) {
    return response
      .status(404)
      .json({ message: `List with ID "${id}" doesn't exist` });
  }

  request.list = {
    indexList: index,
  };

  return next();
};

export const searchForItem = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const index = request.list.indexList;
  const itemName = request.params.itemName;
  const itemNameIndex = lists[index].data.findIndex(
    (obj: iData) => obj.name === itemName
  );

  if (itemNameIndex === -1) {
    return response.status(404).json({
      message: `Item with name "${itemName}" doesn't exist`,
    });
  }

  request.item = {
    indexItem: itemNameIndex,
  };

  return next();
};
