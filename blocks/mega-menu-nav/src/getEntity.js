// getEntity.js
import { select } from "@wordpress/data";

export const getEntity = (
  storeType,
  storeName,
  config = {
    per_page: 100,
    status: ["publish", "draft"],
    order: "desc",
    orderby: "date",
  }
) => {
  return select("core").getEntityRecords(storeType, storeName, config);
};