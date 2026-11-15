import type { IListPage } from "../interfaces/posts.interface";

// the number of the next page
export function nextPageOf(lastPage: { currentPage: number; numberOfPages: number }) {
  if (lastPage.currentPage < lastPage.numberOfPages) {
    return lastPage.currentPage + 1;
  }
  return undefined;
}

// stop duplicated
export function mergeUniqueById<T extends { _id: string }>(pages: IListPage<T>[]): T[] {
  const allItems = pages.flatMap(function (page) {
    return page.items;
  });

  return allItems.filter(function (item, index) {
    return allItems.findIndex(function (other) {
      return other._id === item._id;
    }) === index;
  });
}