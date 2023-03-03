import React from "react";

type Props = {};

export const Toolbar = (props: Props) => {
  return (
    <>
      <select className="ql-font">
        <option value="Arial" selected>
          Arial
        </option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
        <option value="Aharoni">Aharoni</option>
        <option value="Angsana New">Angsana New</option>
        <option value="AngsanaUPC">AngsanaUPC</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Book Antiqua">Book Antiqua</option>
      </select>

      <select className="ql-color" defaultValue="">
        <option value="#e60000"></option>
        <option value="#ff9900"></option>
        <option value="#ffff00"></option>
        <option value="#008a00"></option>
        <option value="#0066cc"></option>
        <option value="#9933ff"></option>
        <option value="#ffffff"></option>
        <option value="#facccc"></option>
        <option value="#ffebcc"></option>
        <option value="#ffffcc"></option>
        <option value="#cce8cc"></option>
        <option value="#cce0f5"></option>
        <option value="#ebd6ff"></option>
        <option value="#bbbbbb"></option>
        <option value="#f06666"></option>
        <option value="#ffc266"></option>
        <option value="#ffff66"></option>
        <option value="#66b966"></option>
        <option value="#66a3e0"></option>
        <option value="#c285ff"></option>
        <option value="#888888"></option>
        <option value="#a10000"></option>
        <option value="#b26b00"></option>
        <option value=""></option>
      </select>

      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="strike"></button>
      <select className="ql-align">
        <option selected></option>
        <option className="ql-right" value="right"></option>
        <option className="ql-center" value="center"></option>
        <option className="ql-justify" value="justify"></option>
      </select>
      <select className="ql-size">
        <option value="8px">8px</option>
        <option value="10px">10px</option>
        <option value="12px" selected>
          12px
        </option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="22px">22px</option>
        <option value="24px">24px</option>
        <option value="36px">36px</option>
      </select>
      <button className="ql-script" value="sub"></button>
      <button className="ql-script" value="super"></button>
      <button className="ql-list" value="ordered"></button>
    </>
  );
};
