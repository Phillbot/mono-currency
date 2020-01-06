import { Currency } from "../api/mono";
import currencies from "../dictionaries/currencies.json";

export const monoCurrencyFetch = setState => {
  fetch(Currency)
    .then(res => res.json())
    .then(res => {
      res.forEach((item: any) => {
        for (let [key, value] of Object.entries(currencies)) {
          if (item.currencyCodeA === value) {
            item.currencyCodeA = key;
          } else if (item.currencyCodeB === value) {
            item.currencyCodeB = key;
          }
        }
      });
      return res;
    })
    .then(
      result => {
        setState({
          isLoaded: true,
          result
        });
      },
      error => {
        setState({
          isLoaded: true,
          error
        });
      }
    );
};
