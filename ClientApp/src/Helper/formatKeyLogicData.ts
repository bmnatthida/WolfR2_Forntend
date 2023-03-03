export const formatKeyLogicData = (logicData: any) => {
  try {
    let _logicData = logicData;
    console.log(_logicData, "_logicData6666");
    _logicData.data.unshift({ item: "-- Please Select --" });
    for (let k = 0; k < _logicData.data.length; k++) {
      const data = _logicData.data[k];
      const keyValues = Object.keys(data).map((key) => {
        const newKey = "item";
        return { [newKey]: data[key] };
      });
      _logicData.data[k] = keyValues[0];
    }
    console.log({ _logicData });

    return _logicData;
  } catch (error) {
    console.log("logic=>formatKeyLogicData=>error", error);
  }
};
