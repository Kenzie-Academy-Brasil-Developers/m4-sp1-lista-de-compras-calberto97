import express, {
  Application,
  json,
  Request,
  Response,
} from "express";
import { lists } from "./database";
import {
  iData,
  iList,
  tDataRequiredKeys,
  tListRequiredKeys,
} from "./interfaces";
import {
  deleteItem,
  deleteList,
  newList,
  showAllLists,
  showChosenList,
  updateItem,
} from "./logic";
import { searchForItem, searchForList } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/purchaseList", newList);

app.get("/purchaseList", showAllLists);

app.get("/purchaseList/:id", searchForList, showChosenList);

app.delete("/purchaseList/:id/:itemName", searchForList, searchForItem, deleteItem);

app.delete("/purchaseList/:id", searchForList, deleteList);

app.patch("/purchaseList/:id/:itemName", searchForList, searchForItem, updateItem);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, () => console.log(runningMsg));
