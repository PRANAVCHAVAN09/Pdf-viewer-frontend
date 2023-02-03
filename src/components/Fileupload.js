import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import Datadisplay from "./Datadisplay";
import "./Fileupload.css";
import { Viewer } from "@react-pdf-viewer/core";
import { Document, Page, pdfjs } from "react-pdf";

const Fileupload = () => {
  let [userData, setUserData] = useState([]);
  const [updateTrigger, setupdateTrigger] = useState(false);
  const [url, setUrl] = useState("");
  const [trigger, setTriggger] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [id, setId] = useState();

  const texthandler = (e) => {
    // if (!e.target.value) {
    //   console.log(name);
    // }
    setName(e.target.value);
    console.log(e.target.value);
  };
  const filehandler = (e) => {
    setFile(e.target.files[0]);
    console.lof(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  };
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    getData();
    setTriggger(false);
    setupdateTrigger(false);

    // console.log(userData);
  }, []);
  useEffect(() => {
    getData();
  }, [updateTrigger]);

  const upload = async () => {
    try {
      let payload = new FormData();
      payload.append("name", name);
      payload.append("myfile", file);

      await axios.post(`http://localhost:8000/api/create`, payload, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      let res = await axios.get(`http://localhost:8000/api/users`);
      setUserData([...res.data]);
      console.log(res.data);
      setName("");
      setUrl("");
      setFile("");
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    let res = await axios.get(`http://localhost:8000/api/users`);
    setUserData([...res.data]);
  };

  const editData = async (userId) => {
    const res = await axios.get(`http://localhost:8000/api/users/${userId}`);
    const { data } = res;
    setName(data[0].name);
    setFileUrl(data[0].fileUrl);
    setId(data[0]._id);
    setUrl(`http://localhost:8000/uploads/${data[0].fileUrl}`);
    setTriggger(true);
  };

  const updateData = async (id, name, fileUrl, file) => {
    console.log(name);
    try {
      let payload = new FormData();

      payload.set("name", name);
      payload.append("myfile", file);
      payload.set("fileUrl", fileUrl);
      let res = await axios.put(
        `http://localhost:8000/api/update/${id}`,
        payload
      );
      userData.map((user) => {
        if (user._id == id) {
          user.name = name;
          user.fileUrl = fileUrl;
        }
      });
      setUserData([...userData]);
      setupdateTrigger(true);
      setTriggger(false);
    } catch (e) {
      console.log(e);
    }
  };
  const delData = async (userId, fileUrl) => {
    await axios.post(`http://localhost:8000/api/delete`, {
      _id: userId,
      fileUrl: fileUrl,
    });
    userData = userData.filter((user) => user._id !== userId);
    console.log(userData);
    setUserData([...userData]);
  };
  const remove = () => {
    setUrl("");
    setFile("");
    console.log(file);
    console.log(name);
  };

  return (
    <div class="container">
      <h1>File Upload</h1>
      <form id="form">
        <div class="input-group">
          <label for="name">Your name</label>
          {/* <h1>{console.log(id)}</h1> */}
          <input
            name="name"
            id="name"
            value={name}
            placeholder="Enter your name"
            onChange={texthandler}
          />
        </div>
        <div class="input-group">
          <label for="files">Select files</label>
          <input id="files" type="file" onChange={filehandler} />
        </div>
        <div class="mt4" style={{ height: "300px" }}>
          {url ? (
            <div class="pdfupload">
              <Viewer fileUrl={url} />
              <input
                class="remove-btn"
                type="button"
                value="Remove"
                onClick={remove}
              ></input>
            </div>
          ) : (
            <div class="nopdf">Preview area</div>
          )}
        </div>
        {trigger ? (
          <button
            class="submit-btn"
            type="button"
            onClick={() => updateData(id, name, fileUrl, file)}
          >
            update
          </button>
        ) : (
          <button class="submit-btn" type="button" onClick={upload}>
            Upload
          </button>
        )}
      </form>
      <Datadisplay
        userData={userData}
        getData={getData}
        editData={editData}
        delData={delData}
        setupdateTrigger={setupdateTrigger}
      ></Datadisplay>
    </div>
  );
};

export default Fileupload;
