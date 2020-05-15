import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname = "/", query = {} } = parse(req.url || "", true);
  const { fontSize, images, widths, heights, md } = query;

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }

  const arr = pathname ? pathname.slice(1).split(".") : [];
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    theme: "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
  };
  parsedRequest.images = getDefaultImages(parsedRequest.images);
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
  return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[]): string[] {
  if (images.length > 0 && images[0]) {
    return images;
  }
  return ["https://static.golocal.rocks/images/go_local_card_logo.svg"];
}
