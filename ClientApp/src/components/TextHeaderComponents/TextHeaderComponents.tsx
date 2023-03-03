import React, { useEffect } from "react";

interface Props {
  textHeaderProps?: any;
  textSubProps?: any;
  isRequir?: boolean;
  colorProps?: any;
}

export const TextHeaderComponents = (props: Props) => {
  useEffect(() => {}, []);
  return (
    <div className="textheader-container">
      {props.isRequir ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: " 13px",
              lineHeight: "15px",
              marginBottom: "2px",
              color: "#262A2D",
              fontWeight: 700,
            }}
          >
            {props.textHeaderProps}
          </p>

          <span
            style={{
              color: "red",
            }}
          >
            *
          </span>
        </div>
      ) : (
        <p
          style={{
            fontSize: " 13px",
            lineHeight: "15px",
            marginBottom: "2px",
            color: "#262A2D",
            fontWeight: 700,
          }}
        >
          {props.textHeaderProps}
        </p>
      )}

      <p
        style={{
          fontSize: " 13px",
          lineHeight: "15px",
          marginBottom: "2px",
          color: props.colorProps !== undefined ? props.colorProps : " #7C7C7C",
        }}
      >
        {props.textSubProps}
      </p>
    </div>
  );
};
