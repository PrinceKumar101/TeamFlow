export type responseType<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<string>;
};
