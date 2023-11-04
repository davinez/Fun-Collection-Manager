// {
//   "code:": 200
//   "status": "success",
//   "data": {
//     /* Application-specific data would go here. */
//   },
//   "message": null /* Or optional success message */
// }

export type TApiResponse = {
  code: number;
  status: string;
  data: object | null;
  messsage: string | null;
}
