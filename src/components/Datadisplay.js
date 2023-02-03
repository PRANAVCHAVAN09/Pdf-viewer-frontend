import axios from "axios";
import "./Datadisplay.css";
import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import File from "./File";

const Datadisplay = ({
  userData,
  editData,
  delData,
  setupdateTrigger,
  getData,
}) => {
  return (
    <div id="container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>File</th>
          </tr>
        </thead>
        {userData.map((user) => {
          return (
            <>
              <tbody key={uuid()}>
                <tr>
                  <td>{user.name}</td>
                  <td>
                    <File fileUrl={user.fileUrl}></File>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => delData(user._id, user.fileUrl)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => editData(user._id)}>
                      edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </>
          );
        })}
      </table>
    </div>
  );
};

export default Datadisplay;
