import { Request, Response } from "express";
import { lists } from "./database";
import {
  iData,
  iList,
  tDataRequiredKeys,
  tListRequiredKeys,
} from "./interfaces";

const validateData = (payload: any): iData[] => {
  if (payload.data || payload instanceof Array) {
    payload.forEach((x: iData) => {
      const payloadKeys = Object.keys(x);
      const requiredKeys: tDataRequiredKeys[] = ["name", "quantity"];

      const check = requiredKeys.every((key) => {
        return payloadKeys.includes(key);
      });

      if (!check) {
        throw new Error(
          `Required keys are "${requiredKeys}". You sent "${payloadKeys}"`
        );
      }

      const checkExtra = payloadKeys.every((key) => {
        return requiredKeys.includes(key as any);
      });

      if (!checkExtra) {
        const extraKey = payloadKeys.filter(
          (key) => !requiredKeys.includes(key as any)
        );
        throw new Error(
          `Your data item has an unsolicited key "${extraKey}". We only accept "${requiredKeys}".`
        );
      }
    });

    payload.forEach((arr: iData) => {
      if (typeof arr.name !== "string") {
        throw new Error('Type of "name" must be string.');
      } else if (typeof arr.quantity !== "string") {
        throw new Error('Type of "quantity" must be string.');
      }
    });

    return payload;
  }

  throw new Error('Type of "data" must be array.');
};

const validateListData = (payload: any): iList => {
  const payloadKeys = Object.keys(payload);
  const requiredKeys: tListRequiredKeys[] = ["listName", "data"];

  const check = requiredKeys.every((key) => {
    return payloadKeys.includes(key);
  });

  if (!check) {
    throw new Error(
      `Required keys are "${requiredKeys}". You sent "${payloadKeys}"`
    );
  }

  const checkExtra = payloadKeys.every((key) => {
    return requiredKeys.includes(key as any);
  });

  if (!checkExtra) {
    const extraKey = payloadKeys.filter(
      (key) => !requiredKeys.includes(key as any)
    );
    throw new Error(
      `Your request has an unsolicited key "${extraKey}". We only accept "${requiredKeys}".`
    );
  }

  if (typeof payload.listName !== "string") {
    throw new Error('Type of "listName" must be string');
  }

  if (!Array.isArray(payload.data)) {
    throw new Error('Type of "data" must be array');
  }

  return payload;
};

export const newList = (
  request: Request,
  response: Response
): Response => {
  try {
    const requestData: iData[] = validateData(request.body.data);

    const requestListData: iList = validateListData(request.body);

    lists.forEach((list, index) => {
      if (list.id !== index + 1) {
        lists[index].id = index + 1;
      }
    });

    const responseListData: iList = {
      ...requestListData,
      id: lists.length + 1,
    };

    lists.push(responseListData);
    return response.status(201).json(responseListData);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }
    console.log(error);
    return response.status(500).json({ message: error });
  }
};

export const showAllLists = (
  request: Request,
  response: Response
): Response => {
  return response.status(200).json(lists);
};

export const showChosenList = (
  request: Request,
  response: Response
): Response => {
  const index = request.list.indexList;

  return response.json(lists[index]);
};

export const deleteItem = (
  request: Request,
  response: Response
): Response => {
  const index = request.list.indexList
  const indexItem = request.item.indexItem
  lists[index].data.splice(indexItem, 1);

  return response.status(204).send();
};

export const deleteList = (
  request: Request,
  response: Response
): Response => {
  const index = request.list.indexList;

  lists.splice(index, 1);
  return response.status(204).send();
};

export const updateItem = (
  request: Request,
  response: Response
): Response => {
  try {
    // const id = Number(request.params.id);
    // const index = lists.findIndex((list) => list.id === id);

    // if (index === -1) {
    //   return response
    //     .status(404)
    //     .json({ message: `List with ID "${id}" doesn't exist` });
    // }
    // const itemName = request.params.itemName;
    // const itemNameIndex = lists[index].data.findIndex(
    //   (obj: iData) => obj.name === itemName
    // );

    // if (itemNameIndex === -1) {
    //   return response.status(404).json({
    //     message: `Item with name "${itemName}" doesn't exist`,
    //   });
    // }

    //fazer validação das chaves enviadas
    // console.log([request.body])
    validateData([request.body]);

    //fazer validação dos tipos dos valores enviados

    // const indexOfItem = lists[index].data
    //   .map((arr) => arr.name)
    //   .indexOf(request.params.itemName);

      const index = request.list.indexList;
      const indexItem = request.item.indexItem;

    lists[index].data[indexItem] = {
      ...lists[index].data[indexItem],
      ...request.body,
    };

    return response.json(lists[index].data[indexItem]);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }
    console.log(error);
    return response.status(500).json({ message: error });
  }
};
