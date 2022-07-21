import React from "react";
import ReactDOM from "react-dom";
export default function User() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `  <iframe
        width="1000"
        height="800"
        src="https://datastudio.google.com/embed/reporting/8ed29b12-053b-4973-9ac8-e1557965bdfa/page/8fzxC"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        title="user-report"
      ></iframe>`,
      }}
    ></div>
  );
}
