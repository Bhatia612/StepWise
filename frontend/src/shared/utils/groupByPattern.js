const groupByPattern = (items) => {
  const groups = {};

  items.forEach((item) => {
    if (!groups[item.pattern]) {
      groups[item.pattern] = [];
    }
    groups[item.pattern].push(item);
  });

  return Object.entries(groups).map(([pattern, entries]) => ({
    pattern,
    entries,
  }));
};

export default groupByPattern;