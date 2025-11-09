import { Draft, produce } from "immer";
import type { Collection } from "@/lib/query-toolkit-v2/collection";

export interface OptimisticUpdaterOptions<Entity> {
  sync?: boolean;
  syncFn?: (state: Entity) => Optimistic<Entity>;
  rollback?: boolean;
  type?: "active" | "all";
  queryKey?: unknown[];
}

export interface OptimisticUpdater<Entity, State> {
  prepend(item: Entity, state: State): State;
  prependIfNotExists(item: Entity, state: State): State;
  append(item: Entity, state: State): State;
  appendIfNotExists(item: Entity, state: State): State;
  update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    state: State,
  ): State;
  delete(id: string, state: State): State;
  replace: (id: string, item: Optimistic<Entity>, state: State) => State;
  replaceAt: (index: number, item: Optimistic<Entity>, state: State) => State;
  replaceLast: (item: Optimistic<Entity>, state: State) => State;
  replaceAll: (items: Entity[], state: State) => State;
  move: (id: string, position: number, state: State) => State;
  filter: (
    updateFn: (item: Optimistic<Entity>) => boolean,
    state: State,
  ) => State;
}

export class PartitionedOptimisticUpdater<Entity>
  implements OptimisticUpdater<Entity, Paginated<Entity[]>>
{
  constructor(private readonly collection: Collection<Entity>) {}

  prepend(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].unshift(item as Draft<Entity>);
    });
  }

  prependIfNotExists(
    item: Entity,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      const itemId = this.collection.getEntityId(item as Optimistic<Entity>);
      const exists = draft.pages.some((page) =>
        page.some(
          (existingItem) =>
            this.collection.getEntityId(existingItem as Optimistic<Entity>) ===
            itemId,
        ),
      );

      if (!exists) {
        draft.pages[0].unshift(item as Draft<Entity>);
      }
    });
  }

  append(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].push(item as Draft<Entity>);
    });
  }

  appendIfNotExists(
    item: Entity,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      const itemId = this.collection.getEntityId(item as Optimistic<Entity>);
      const exists = draft.pages.some((page) =>
        page.some(
          (existingItem) =>
            this.collection.getEntityId(existingItem as Optimistic<Entity>) ===
            itemId,
        ),
      );

      if (!exists) {
        draft.pages[0].push(item as Draft<Entity>);
      }
    });
  }

  update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    state: Paginated<Optimistic<Entity>[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page) => {
        const foundIndex = page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (foundIndex !== -1) {
          updateFn(page[foundIndex]);
        }
      });
    });
  }

  filter(
    filterFn: (item: Optimistic<Entity>) => boolean,
    state: Paginated<Entity[]>,
  ) {
    return produce(state, (draft) => {
      draft.pages = draft.pages.map((page) =>
        page.filter((item) => filterFn(item as Optimistic<Entity>)),
      );
    });
  }

  delete(
    id: string,
    state: Paginated<Optimistic<Entity>[]>,
  ): Paginated<Optimistic<Entity>[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page) => {
        const foundIndex = page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (foundIndex !== -1) {
          page.splice(foundIndex, 1);
        }
      });
    });
  }

  replace(
    id: string,
    item: Optimistic<Entity>,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page) => {
        const foundIndex = page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (foundIndex !== -1) {
          page[foundIndex] = item as Draft<Optimistic<Entity>>;
        }
      });
    });
  }

  replaceAt(
    index: number,
    item: Optimistic<Entity>,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      let currentIndex = 0;

      for (const page of draft.pages) {
        if (currentIndex + page.length > index) {
          const pageIndex = index - currentIndex;
          page[pageIndex] = item as Draft<Optimistic<Entity>>;
          break;
        }
        currentIndex += page.length;
      }
    });
  }

  replaceLast(
    item: Optimistic<Entity>,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      let currentPageIndex = draft.pages.length - 1;
      while (
        currentPageIndex >= 0 &&
        draft.pages[currentPageIndex].length === 0
      ) {
        currentPageIndex--;
      }

      if (currentPageIndex >= 0 && draft.pages[currentPageIndex].length > 0) {
        draft.pages[currentPageIndex][
          draft.pages[currentPageIndex].length - 1
        ] = item as Draft<Optimistic<Entity>>;
      } else {
        draft.pages.push([item as Draft<Optimistic<Entity>>]);
      }
    });
  }

  replaceAll(items: Entity[], state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages = [items as Draft<Entity>[]];
    });
  }

  move(
    id: string,
    position: number,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      let targetItem: Optimistic<Entity> | undefined;
      let sourcePageIndex = -1;
      let sourceItemIndex = -1;

      // Find the item and its current position
      draft.pages.forEach((page, pageIndex) => {
        const itemIndex = page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );
        if (itemIndex !== -1) {
          sourcePageIndex = pageIndex;
          sourceItemIndex = itemIndex;
          targetItem = page[itemIndex] as any;
        }
      });

      if (!targetItem || sourcePageIndex === -1 || sourceItemIndex === -1) {
        return;
      }

      draft.pages[sourcePageIndex].splice(sourceItemIndex, 1);

      let itemsBefore = 0;
      let targetPageIndex = 0;
      let targetItemIndex = position;

      for (let i = 0; i < draft.pages.length; i++) {
        if (itemsBefore + draft.pages[i].length > position) {
          targetPageIndex = i;
          targetItemIndex = position - itemsBefore;
          break;
        }
        itemsBefore += draft.pages[i].length;
      }

      if (targetPageIndex >= draft.pages.length) {
        draft.pages.push([]);
        targetPageIndex = draft.pages.length - 1;
        targetItemIndex = 0;
      }

      draft.pages[targetPageIndex].splice(
        targetItemIndex,
        0,
        targetItem as Draft<Optimistic<Entity>>,
      );

      draft.pages = draft.pages.filter((page) => page.length > 0);
    });
  }
}

export class LiveOptimisticUpdater<Entity>
  implements OptimisticUpdater<Entity, Entity[]>
{
  constructor(private readonly collection: Collection<Entity>) {}

  prepend(item: Entity, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      draft.unshift(item as Draft<Entity>);
    });
  }

  prependIfNotExists(item: Entity, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      const itemId = this.collection.getEntityId(item as Optimistic<Entity>);
      const exists = draft.some(
        (existingItem) =>
          this.collection.getEntityId(existingItem as Optimistic<Entity>) ===
          itemId,
      );

      if (!exists) {
        draft.unshift(item as Draft<Entity>);
      }
    });
  }

  append(item: Entity, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      draft.push(item as Draft<Entity>);
    });
  }

  appendIfNotExists(item: Entity, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      const itemId = this.collection.getEntityId(item as Optimistic<Entity>);
      const exists = draft.some(
        (existingItem) =>
          this.collection.getEntityId(existingItem as Optimistic<Entity>) ===
          itemId,
      );

      if (!exists) {
        draft.push(item as Draft<Entity>);
      }
    });
  }

  update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    state: Optimistic<Entity>[],
  ): Entity[] {
    return produce(state, (draft) => {
      const foundIndex = draft.findIndex(
        (entity) =>
          this.collection.getEntityId(entity as Optimistic<Entity>) === id,
      );

      if (foundIndex !== -1) {
        updateFn(draft[foundIndex]);
      }
    });
  }
  delete(id: string, state: Optimistic<Entity>[]): Optimistic<Entity>[] {
    return produce(state, (draft) => {
      const foundIndex = draft.findIndex(
        (post) =>
          this.collection.getEntityId(post as Optimistic<Entity>) === id,
      );

      if (foundIndex !== -1) {
        draft.splice(foundIndex, 1);
      }
    });
  }
  replace(id: string, item: Optimistic<Entity>, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      const foundIndex = draft.findIndex(
        (post) =>
          this.collection.getEntityId(post as Optimistic<Entity>) === id,
      );

      if (foundIndex !== -1) {
        draft[foundIndex] = item as Draft<Optimistic<Entity>>;
      }
    });
  }

  replaceAt(
    index: number,
    item: Optimistic<Entity>,
    state: Entity[],
  ): Entity[] {
    return produce(state, (draft) => {
      draft[index] = item as Draft<Optimistic<Entity>>;
    });
  }

  replaceLast(item: Optimistic<Entity>, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      if (draft.length > 0) {
        draft[draft.length - 1] = item as Draft<Optimistic<Entity>>;
      } else {
        draft.push(item as Draft<Optimistic<Entity>>);
      }
    });
  }

  replaceAll(items: Entity[], state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      draft.splice(0, draft.length, ...(items as Draft<Entity>[]));
    });
  }

  move(id: string, position: number, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      const sourceIndex = draft.findIndex(
        (post) =>
          this.collection.getEntityId(post as Optimistic<Entity>) === id,
      );

      if (sourceIndex === -1) {
        return;
      }

      const [targetItem] = draft.splice(sourceIndex, 1);

      const targetIndex = Math.max(0, Math.min(position, draft.length));

      draft.splice(targetIndex, 0, targetItem as Draft<Optimistic<Entity>>);
    });
  }

  filter(filterFn: (item: Optimistic<Entity>) => boolean, state: Entity[]) {
    return produce(state, (draft) => {
      return draft.filter(filterFn as (item: Draft<Entity>) => boolean);
    });
  }
}

export class EntityOptimisticUpdater<Item> {
  update(
    updateFn: (item: Draft<Optimistic<Item>>) => void,
    state: Optimistic<Item>,
  ): Optimistic<Item> {
    return produce(state, (draft) => {
      updateFn(draft);
    });
  }
}
