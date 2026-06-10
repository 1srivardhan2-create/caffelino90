// Minimal stub - app uses localStorage exclusively
// This file exists only to prevent deployment errors

export const set = async (_key: string, _value: any): Promise<void> => {
  // No-op
};

export const get = async (_key: string): Promise<any> => {
  return null;
};

export const del = async (_key: string): Promise<void> => {
  // No-op
};

export const mset = async (_keys: string[], _values: any[]): Promise<void> => {
  // No-op
};

export const mget = async (_keys: string[]): Promise<any[]> => {
  return [];
};

export const mdel = async (_keys: string[]): Promise<void> => {
  // No-op
};

export const getByPrefix = async (_prefix: string): Promise<any[]> => {
  return [];
};
