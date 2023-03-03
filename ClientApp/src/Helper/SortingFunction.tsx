export const sorterFunc = (
  a: any,
  b: any,
  key: string,
  type: "dec" | "asc" | null
) => {
  try {
    let nameA: any;
    let nameB: any;

    if (key.toLowerCase().includes("date")) {
      nameA = a[key] || a[key] !== "" ? new Date(a[key]).getTime() : "";
      nameB = b[key] || b[key] !== "" ? new Date(b[key]).getTime() : "";
      if (type === "asc") {
        return nameA - nameB;
      } else {
        return nameB - nameA;
      }
    } else {
      if (!isNaN(a[key]?.replaceAll(",", ""))) {
        nameA = Number(a[key]?.replaceAll(",", ""));
        nameB = Number(b[key]?.replaceAll(",", ""));

        if (type === "asc") {
          return nameA - nameB;
        } else {
          return nameB - nameA;
        }
      } else {
        nameA = a[key]?.toString().toLowerCase();
        nameB = b[key]?.toString().toLowerCase();
        if (type === "asc") {
          if (nameA > nameB) {
            return 1;
          } else if (nameB > nameA) {
            return -1;
          }
        } else {
          if (nameA > nameB) {
            return -1;
          } else if (nameB > nameA) {
            return 1;
          }
        }
        return 0;
      }
    }
  } catch (error) {
    console.log("helper=>sorterFunc=>error", error);
  }
};
