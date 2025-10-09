import {useLiveEntity} from "@/lib/query-toolkit-v2";
import {blazeBalanceEntity} from "@/features/wallet/entities/blaze-balance.entity";
import {useMe} from "@/features/auth/queries/use-me";

export const useBlazeBalance = () => {
  const { data: me } = useMe()

  return useLiveEntity<BlazeBalance>({
    entity: blazeBalanceEntity,
    queryKey: ['me', 'blazeBalance'],
    options: {
      enabled: Boolean(me),
    }
  })
}