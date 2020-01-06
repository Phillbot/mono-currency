export const searchCurr = (text: any, setState: Function, currs: any[]) => {
  text
    .replace(/ /g, "|")
    .replace(/,/g, "|")
    .trim();

  const re = new RegExp(text, "gi");
  let filterData = currs.filter((curr: any) => {
    return re.test(curr.currencyCodeA) || re.test(curr.currencyCodeB);
  });
  filterData = text.length < 1 ? (filterData = []) : filterData;
  setState({
    filterData
  });
};
