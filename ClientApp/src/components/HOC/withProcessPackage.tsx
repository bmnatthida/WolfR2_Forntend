import React, { useEffect, useState } from "react";
const withProcessPackage =
  (Component: any) =>
  ({ ...props }) => {
    const [onLoading, setOnLoading] = useState(true);

    useEffect(() => {}, []);

    return onLoading ? <div /> : <Component {...props} />;
  };
export default withProcessPackage;
