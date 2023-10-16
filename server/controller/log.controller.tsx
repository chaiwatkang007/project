import { IQuerys } from "../interface/common.interface";
import { Addlog } from "../interface/log.interface";
import Log from "../model/log.model";
import { v4 } from "uuid";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
    };
  }
  return body;
};

const logController = {
  log: async (args: IQuerys) => {
    return Log.findAndCountAll({
      where: genQuery(args),
      limit: args?.limit,
      offset: args?.skip,
    }).then(({ rows, count }) => {
      return { count, rows: rows };
    });
  },
  addlog: async (args: Addlog) => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();

    const newLog = {
      id: v4(),
      day: currentDate,
      time: currentTime,
      event_happening: args.event_happening,
    };
    

    const result = await Log.create(newLog);
    return result;
  },
};

export default logController;
