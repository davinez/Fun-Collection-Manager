// Google JSON Style Guide https://google.github.io/styleguide/jsoncstyleguide.xml?showone=data#data

// Succes Response
// {
//   "data": {
//     "id": 1001,
//     "name": "Wing"
//   }
// }

// Error Response
// {
//   "apiVersion": "2.0",
//   "error": {
//     "code": 404,
//     "message": "File Not Found",
//     "errors": [{
//       "domain": "Calendar",
//       "reason": "ResourceNotFoundException",
//       "message": "File Not Found
//     }]
//   }
// }

export type TApiResponse<T extends object | undefined = undefined> = {
  data: T;
}

type TApiError = {
  domain: string;
  reason: string;
  message: string;
}

type TApiTopLevelError = {
  code: number;
  message: string;
  errors: TApiError[];
}

export type TApiErrorResponse = {
  apiVersion: string;
  error: TApiTopLevelError;
}

