import React, { useState } from "react";
import "./UploadResource.css";
import { Upload, Button, Input, Tabs } from "antd";
import axios from "axios";
import {
  UploadOutlined,
  FileOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const UploadResource = () => {
  const [doc, setDoc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [postDetails, setPostDetails] = useState({
    title: "",
    desc: "",
  });

  const handleChange = (e) => {
    setPostDetails({ ...postDetails, [e.target.name]: e.target.value });
  };

  const handleDocChange = (info) => {
    if (info.fileList && info.fileList[0]?.originFileObj) {
      setDoc(info.fileList[0].originFileObj);
    }
  };

  const handleImgChange = (info) => {
    if (info.fileList && info.fileList[0]?.originFileObj) {
      setImageFile(info.fileList[0].originFileObj);
    }
  };

  const handleAudChange = (info) => {
    if (info.fileList && info.fileList[0]?.originFileObj) {
      setAudioFile(info.fileList[0].originFileObj);
    }
  };

  const handleVidChange = (info) => {
    if (info.fileList && info.fileList[0]?.originFileObj) {
      setVideoFile(info.fileList[0].originFileObj);
    }
  };

  const handleCancel = () => {
    setPostDetails({
      title: "",
      desc: "",
    });
    setAudioFile(null);
    setVideoFile(null);
    setImageFile(null);
    setDoc(null);
  };

  // the upload function here
  const handleUpload = async (e) => {
    e.preventDefault();
    let vid;
    let aud;
    let img;
    let pdf;
    let pdfSize;
    let pdfOriginalName;
    const { title, desc } = postDetails;

    const formData1 = new FormData();
    const formData2 = new FormData();
    const formData3 = new FormData();
    const formData4 = new FormData();

    formData1.append("doc", doc);
    formData2.append("audio", audioFile);
    formData3.append("video", videoFile);
    formData4.append("image", imageFile);

    const url = "http://localhost:3000/library/resources";

    // for video
    if (videoFile) {
      try {
        const result = await axios.post(`${url}/video`, formData3, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        vid = result.data.vid;
        console.log(vid);
      } catch (error) {
        console.log(error);
      }
    }

    // for audio
    if (audioFile) {
      try {
        const result = await axios.post(`${url}/audio`, formData2, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        aud = result.data.audio;
        console.log(aud);
      } catch (error) {
        console.log(error);
      }
    }

    // for documents
    if (doc) {
      try {
        const result = await axios.post(`${url}/doc`, formData1, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        pdf = result.data.doc;
        pdfSize = result.data.pdfSize;
        pdfOriginalName = result.data.pdfOriginalName;
        console.log(pdf);
      } catch (error) {
        console.log(error);
      }
    }

    // for image files
    if (imageFile) {
      try {
        const result = await axios.post(`${url}/image`, formData4, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        img = result.data.img;
        console.log(img);
      } catch (error) {
        console.log(error);
      }
    }

    // posting to the library database
    try {
      const postToDb = await axios.post(
        "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources",
        {
          img,
          pdf,
          doc,
          aud,
          title,
          desc,
          vid,
          pdfSize,
          pdfOriginalName,
          userId: localStorage.getItem("userId"),
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    // cleaning up the input fields
    setPostDetails({
      title: "",
      desc: "",
    });
    setAudioFile(null);
    setVideoFile(null);
    setImageFile(null);
    setDoc(null);

    window.location.reload();
  };
  const items = [
    {
      key: "1",
      label: "Upload",
      children: (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload New Resources</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
            <p>PDF, DOC, PPT, PNG, JPG, MP4, MP3</p>
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <Upload accept='.pdf,.doc,.docx,.txt' onChange={handleDocChange}>
              <Button icon={<FileOutlined />}>Document</Button>
            </Upload>
            <Upload accept='image/*' onChange={handleImgChange}>
              <Button icon={<PictureOutlined />}>Image</Button>
            </Upload>
            <Upload accept='audio/*' onChange={handleAudChange}>
              <Button icon={<SoundOutlined />}>Audio</Button>
            </Upload>
            <Upload accept='video/*' onChange={handleVidChange}>
              <Button icon={<VideoCameraOutlined />}>Video</Button>
            </Upload>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>Title</p>
            <Input
              placeholder='Resource Title'
              style={{ padding: "8px" }}
              name='title'
              value={postDetails.title}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>Description</p>
            <TextArea
              placeholder='Resource Description'
              rows={4}
              name='desc'
              value={postDetails.desc}
              onChange={handleChange}
            />
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type='primary' onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Recent Uploads",
      children: <div style={{ marginTop: "20px" }}></div>,
    },
  ];

  return (
    <div className='uploadResource'>
      <h2>Resources</h2>
      <Tabs defaultActiveKey='1' items={items}></Tabs>
    </div>
  );
};

export default UploadResource;
