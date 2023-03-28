import { Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { GetLogApi } from "../../Services/LogApiService";

export const LogApi = () => {
  const [postDate, setPostDate] = useState<any>();
  const [textLog, setTextLog] = useState<any[]>();
  useEffect(() => {
    fetchGetLogApi();
  }, []);

  async function fetchGetLogApi() {
    var request = postDate;
    console.log("Before=>PostedDate", request);
    var _Log = await GetLogApi(request);
    setTextLog(_Log);
    console.log("_Log", _Log);
    console.log("PostedDate", request);
  }
  const { Search } = Input;
  return (
    <div style={{ marginTop: "10px", marginLeft: "10px" }}>
      <Space direction="vertical">
        <Search
          placeholder="ex. : 2023-03-27"
          onSearch={fetchGetLogApi}
          enterButton
          onChange={(e) => {
            setPostDate(e.target.value);
          }}
        />
      </Space>
      <div style={{ marginTop: "10px" }}>
        {textLog?.map((x) => (
          <p>{x}</p>
        ))}
      </div>
    </div>
  );
};
