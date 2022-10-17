const formatJson = (value) => {
  var ugly = value.replace(/'/g, '"').replace(/\bNone\b(?!")/g, null);
  var obj = JSON.parse(ugly);
  var pretty = JSON.stringify(obj, undefined, 2);
  return pretty;
};

export { formatJson };
