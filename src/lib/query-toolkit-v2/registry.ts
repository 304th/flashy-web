import type { QueryClient } from "@tanstack/react-query";
import type { Collection } from "@/lib/query-toolkit-v2/collection";
import type { Entity } from "@/lib/query-toolkit-v2/entity";
import {
  CollectionOptimisticMutations,
  EntityOptimisticMutations,
} from "@/lib/query-toolkit-v2/optimistic-mutations/optimistic-mutations";
import {
  EntityOptimisticUpdater,
  LiveOptimisticUpdater,
} from "@/lib/query-toolkit-v2/optimistic-mutations/updaters";
import { PartitionedOptimisticUpdater } from "@/lib/query-toolkit-v2/optimistic-mutations/updaters";

type RegisteredCollection = {
  kind: "collection";
  name: string;
  queryKey: unknown[];
  queryClient: QueryClient;
  collection: Collection<any, any>;
};

type RegisteredEntity = {
  kind: "entity";
  name: string;
  queryKey: unknown[];
  queryClient: QueryClient;
  entity: Entity<any, any>;
};

export type RegisteredLive = RegisteredCollection | RegisteredEntity;
type RegisteredPartitioned = {
  kind: "partitioned";
  name: string;
  queryKey: unknown[];
  queryClient: QueryClient;
  collection: Collection<any, any>;
};

export type RegisteredAny = RegisteredLive | RegisteredPartitioned;

class LiveRegistry {
  private readonly nameToEntries: Map<string, Set<RegisteredAny>> = new Map();

  register(name: string, entry: RegisteredAny) {
    if (!this.nameToEntries.has(entry.name)) {
      this.nameToEntries.set(entry.name, new Set());
    }

    this.nameToEntries.get(entry.name)!.add(entry);
  }

  unregister(entry: RegisteredAny) {
    const set = this.nameToEntries.get(entry.name);

    if (!set) {
      return;
    }

    set.delete(entry);

    if (set.size === 0) {
      this.nameToEntries.delete(entry.name);
    }
  }

  list(name: string): RegisteredAny[] {
    return Array.from(this.nameToEntries.get(name) ?? []);
  }

  createCollectionTransaction(entry: RegisteredCollection) {
    return new CollectionOptimisticMutations(
      entry.queryClient,
      entry.queryKey,
      entry.collection,
      new LiveOptimisticUpdater(entry.collection),
    );
  }

  createEntityTransaction(entry: RegisteredEntity) {
    return new EntityOptimisticMutations(
      entry.queryClient,
      entry.queryKey,
      new EntityOptimisticUpdater(),
    );
  }

  createPartitionedTransaction(entry: RegisteredPartitioned) {
    return new CollectionOptimisticMutations(
      entry.queryClient,
      entry.queryKey,
      entry.collection,
      new PartitionedOptimisticUpdater(entry.collection),
    );
  }
}

export const liveRegistry = new LiveRegistry();

export type OptTransaction = {
  rollback: () => void;
  sync?: (data: any) => void;
};

export function aggregateTransactions(
  transactions: OptTransaction[],
): OptTransaction {
  return {
    rollback: () => {
      transactions.forEach((t) => t.rollback());
    },
    sync: (data: any) => {
      transactions.forEach((t) => t.sync?.(data));
    },
  };
}

export type TriggerTarget = string; // name used during registration
