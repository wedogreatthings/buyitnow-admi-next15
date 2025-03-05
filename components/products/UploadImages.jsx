/* eslint-disable react/prop-types */
'use client';

import React, { useContext, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ProductContext from '@/context/ProductContext';

const UploadImages = memo(({ id }) => {
  const { uploadProductImages, productImages, error, loading, clearErrors } =
    useContext(ProductContext);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  console.log('Product images in the upload images component');
  console.log(productImages);

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
        }
      };

      setImages((oldArray) => [...oldArray, file]);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    images.forEach((image) => {
      formData.append('image', image);
    });

    uploadProductImages(formData, id);
  };

  return (
    <div
      style={{ maxWidth: '480px' }}
      className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded-sm bg-white shadow-lg"
    >
      <form onSubmit={submitHandler}>
        <h2 className="mb-3 text-2xl font-semibold">Upload Product Images</h2>

        <div className="mb-4 flex flex-col md:flex-row">
          <div className="w-full">
            <input
              className="form-control block w-full px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-sm transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-hidden mt-8"
              type="file"
              id="formFile"
              multiple
              onChange={onChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 my-5">
          {imagesPreview?.map((img) => (
            <Image
              src={img}
              key={img}
              alt="Preview"
              className="col-span-1 object-contain shadow-sm rounded-sm border-2 border-gray p-2 h-full w-full"
              width="50"
              height="50"
            />
          ))}
        </div>

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          disabled={loading ? true : false}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
});

UploadImages.displayName = 'UploadImages';

export default UploadImages;
