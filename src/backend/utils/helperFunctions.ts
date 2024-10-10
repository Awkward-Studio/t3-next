import { Query } from "appwrite";

export const buildStatusQuery = (statuses: number[], field: string) :any[] =>  {
    return statuses.length > 1 
      ? [Query.or(statuses.map((stat: number) => Query.equal(field, [stat])))]
      : [Query.equal(field, statuses[0])];
  };
  