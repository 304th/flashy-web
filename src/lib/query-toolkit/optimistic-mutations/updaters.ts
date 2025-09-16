import { Draft, produce } from "immer";
import type { Collection } from "@/lib/query-toolkit/collection";
import type { Entity } from "@/lib/query-toolkit/entity";

export interface OptimisticUpdaterOptions {
  sync?: boolean;
  rollback?: boolean;
}

export interface OptimisticUpdater<Entity, State> {
  prepend(item: Entity, state: State): State;
  append(item: Entity, state: State): State;
  update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    state: State,
  ): State;
  delete(id: string, state: State): State;
  replace: (id: string, item: Optimistic<Entity>, state: State) => State;
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
  append(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].push(item as Draft<Entity>);
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
  delete(
    id: string,
    state: Paginated<Optimistic<Entity>[]>,
  ): Paginated<Optimistic<Entity>[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page, index) => {
        //FIXME: SEEMS LIKE ITS NOT WORKING CORRECTLY!!! foundIndex is not USED!!!!
        page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (index !== -1) {
          page.splice(index, 1);
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
      draft.pages.forEach((page, index) => {
        //FIXME: SEEMS LIKE ITS NOT WORKING CORRECTLY!!! foundIndex is not USED!!!!
        page.findIndex(
          (post) =>
            this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (index !== -1) {
          page[index] = item as Draft<Optimistic<Entity>>;
        }
      });
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
  append(item: Entity, state: Entity[]): Entity[] {
    return produce(state, (draft) => {
      draft.push(item as Draft<Entity>);
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
