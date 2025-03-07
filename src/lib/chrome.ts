import { trimUrl } from "./utils";

export type ChromePage = {
  title: string;
  url: string;
  favicon?: string;
};
export async function getCurrentPage(): Promise<ChromePage | undefined> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        resolve({
          title: tabs[0].title || "Unknown",
          url: trimUrl(tabs[0].url),
          favicon: tabs[0].favIconUrl || "",
        });
      } else {
        resolve(undefined);
      }
    });
  });
}
