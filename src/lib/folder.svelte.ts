import { getContext, setContext } from "svelte";

export type Folder = {
  id: number;
  title: string;
};
export class FolderController {}

const FOLDER_CONTROLLER_SYMBOL = Symbol("FOLDER_CONTROLLER");

export function setFolderController() {
  return setContext(FOLDER_CONTROLLER_SYMBOL, new FolderController());
}
export function getFolderController() {
  return getContext<ReturnType<typeof setFolderController>>(
    FOLDER_CONTROLLER_SYMBOL
  );
}
