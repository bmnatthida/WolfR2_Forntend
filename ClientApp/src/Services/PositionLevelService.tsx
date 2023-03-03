export const dataPositionLevelGetByIsActive = async () => {
  let respone = await fetch("api/PositionLevel/GetAll")
    .then((response) => response.json())
    .then((data) => {
      const newList: any = [];
      data = data.filter((e: any) => e.IsActive === true);

      for (let i = 0; i < data.length; i++) {
        const positionLevel = {
          positionLevelId: Number,
          positionLevelNameTh: String,
          positionLevelNameEn: String,
          positionLevel: Number,
        };

        positionLevel.positionLevelId = data[i].PositionLevelId;
        positionLevel.positionLevelNameTh = data[i].NameTh;
        positionLevel.positionLevelNameEn = data[i].NameEn;
        positionLevel.positionLevel = data[i].PositionLevel;
        newList.push(positionLevel);
      }

      return newList;
    });
  return respone;
};
export const AddPositionLevel = async (dataJson: any) => {
  const respone = await fetch("api/PositionLevel/AddPositionLevel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    })
    .catch((err) => {});
  return respone;
};
export const UpdatePositionLevel = async (dataJson: any) => {
  const respone = await fetch("api/PositionLevel/AddPositionLevel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    })
    .catch((err) => {});
  return respone;
};
