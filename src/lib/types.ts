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
  URGENT: 0,
  TO_READ: 1,
  READ: 2,
});
export type ReadingStatus = (typeof ReadingStatus)[keyof typeof ReadingStatus];
export interface Website {
  id: string;
  folderName?: string;
  title: string;
  url: string;
  favicon?: string;
  status: ReadingStatus;
}

export interface ReadingFolder {
  
  websites: Website[];
  expanded: boolean;
  showAll: boolean;
}
