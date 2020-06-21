export type Action<T> = {
  type: T;
  [key: string]: any;
};

export type Value = string | number | undefined;
