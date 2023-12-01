// {
//   "code:": 200
//   "status": "success",
//   "data": {
//     /* Application-specific data would go here. */
//   },
//   "message": null /* Or optional success message */
// }

export type TApiResponse<T extends object | undefined = undefined> = {
  code: number;
  status: string;
  data: T;
  messsage: string | undefined;
}
