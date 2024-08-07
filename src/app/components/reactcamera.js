import React, { useState, useRef } from "react";
import {Camera} from "react-camera-pro";
import { storage } from '../../../firebase';
import { ref, uploadBytes } from 'firebase/storage';

export default function ReactCamera() {

  const camera = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);

  const uploadImage = () => {
    if (imageUpload == null) {
      return;
    }

    const imageRef = ref(storage, `images/${imageUpload.name + Date.now()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert('Image uploaded successfully');
    });
  };

  return (
    <div>
      <Camera ref={camera} />
      <button onClick={() => setImageUpload(camera.current.takePhoto())}>Take photo</button>
      <img src={imageUpload} alt='Taken photo' width={"100px"} height={"100px"}/>
    </div>
  );
}