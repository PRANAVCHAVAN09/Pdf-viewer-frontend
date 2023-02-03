import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

const File = ({ fileUrl }) => {
  const pdf = fileUrl ? `http://localhost:8000/uploads/${fileUrl}` : "";

  return (
    <>
      <a href={pdf} target="blank">
        get pdf
      </a>
    </>
  );
};

export default File;
