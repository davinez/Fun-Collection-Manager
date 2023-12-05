// {
//   "statusCode": 200,
//   "message": "Data retrieved successfully",
//   "data": ["Item 1", "Item 2", "Item 3"]
// }
// {
//   "statusCode": 404,
//   "message": "Resource not found",
//   "data": null
// }

export type TApiResponse<T extends object | undefined = undefined> = {
  statusCode: number;
  messsage: string | undefined;
  data: T;
}
