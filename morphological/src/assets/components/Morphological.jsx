import React, { useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Morphological = () => {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const binarizeImage = (ctx, width, height, threshold = 128) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const value = avg > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);
    return imageData;
  };

  const erodeImage = (binaryData, width, height) => {
    const erodedData = new Uint8ClampedArray(binaryData.data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        const neighbors = [
          binaryData.data[index - width * 4],
          binaryData.data[index + width * 4],
          binaryData.data[index - 4],
          binaryData.data[index + 4],
        ];
        const isEroded = neighbors.every((val) => val === 255);
        erodedData[index] =
          erodedData[index + 1] =
          erodedData[index + 2] =
            isEroded ? 255 : 0;
      }
    }
    return new ImageData(erodedData, width, height);
  };

  const findBoundary = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const binaryImage = binarizeImage(ctx, width, height);
    const erodedImage = erodeImage(binaryImage, width, height);

    const boundaryData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < boundaryData.data.length; i += 4) {
      boundaryData.data[i] =
        boundaryData.data[i + 1] =
        boundaryData.data[i + 2] =
          binaryImage.data[i] - erodedImage.data[i] > 0 ? 255 : 0;
    }

    ctx.putImageData(boundaryData, 0, 0);
  };

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      findBoundary();
    };
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <button
        className="bg-green-500 p-2 text-white rounded-lg"
        onClick={drawImageOnCanvas}
      >
        Process Image
      </button>

      <div className="w-auto flex items-center gap-8">
        {image && (
          <img src={image} alt="Uploaded" className="w-[500] h-96 mt-4" />
        )}

        {image && <FaArrowRightLong color="black" size={30} />}

        <canvas ref={canvasRef} className="w-[500] h-96 mt-4" />
      </div>
    </div>
  );
};

export default Morphological;
