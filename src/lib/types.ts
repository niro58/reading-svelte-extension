type Success<T> = {
  success: true;
  data: T;
};
type Failure<> = {
  success: false;
  error: string;
};
export type Result<T> = Success<T> | Failure;

export const ReadingStatus = Object.freeze({
  TO_READ: 0,
  URGENT: 1,
  ARCHIVED: 2,
});
export type ReadingStatus = (typeof ReadingStatus)[keyof typeof ReadingStatus];
export interface Website {
  id: number;
  folderName: string;
  title: string;
  url: string;
  favicon?: string;
  status: ReadingStatus;
  createdAt: number;
}

export interface ReadingFolder {
  websites: Website[];
  expanded: boolean;
  showAll: boolean;
}
