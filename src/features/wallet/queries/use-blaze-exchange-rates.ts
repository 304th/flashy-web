import {getQuery} from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";

export const useBlazeExchangeRates = () => getQuery(['blaze', 'rate'], async () => {
  return api.get('blaze/exchangeRate').json<{ rate: { price: number }; oldRate: { price: number } }>();
})