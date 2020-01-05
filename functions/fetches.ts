import { Currency } from "../api/mono";

export const monoCurrencyFetch = setState => {
  fetch(Currency)
    .then(res => res.json())
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
