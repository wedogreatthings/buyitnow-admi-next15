/* eslint-disable react/prop-types */
'use client';

import React, { useContext, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import ProductContext from '@/context/ProductContext';

const UploadImages = memo(({ id }) => {
  const {
    uploadProductImages,
    productImages,
    removeProductImage,
    error,
    loading,
    clearErrors,
  } = useContext(ProductContext);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isRemoving, setIsRemoving] = useState({});

  // Reset previews when component mounts or productImages changes
  useEffect(() => {
    setImagesPreview([]);
  }, [productImages]);

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

  const handleRemoveImage = async (imageToRemove) => {
    // If it's a newly added preview image
    if (
      typeof imageToRemove === 'string' &&
      imageToRemove.startsWith('data:')
    ) {
      setImagesPreview((prev) => prev.filter((img) => img !== imageToRemove));
      setImages((prev) =>
        prev.filter(
          (_, index) => imagesPreview.indexOf(imageToRemove) !== index,
        ),
      );
      return;
    }

    // If it's an existing product image
    if (imageToRemove._id) {
      try {
        // Start removal animation
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: true }));

        // Wait a moment for animation before actual removal
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Call context method to remove image
        await removeProductImage(id, imageToRemove._id);

        // Optional: Add success toast
        toast.success('Image removed successfully');
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // Revert removal animation if failed
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: false }));
        toast.error('Failed to remove image');
      }
    }
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

        {/* Existing Product Images */}
        {productImages && productImages.length > 0 && (
          <div className="grid grid-cols-6 gap-2 my-5">
            {productImages.map((img) => (
              <div key={img._id} className="relative col-span-1 group">
                <Image
                  src={img.url}
                  alt="Product"
                  className={`object-contain shadow-sm rounded-sm border-2 border-gray p-2 h-full w-full transition-all duration-300 ${
                    isRemoving[img._id] ? 'opacity-0 scale-75' : 'opacity-100'
                  }`}
                  width="50"
                  height="50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Preview of New Images */}
        {imagesPreview.length > 0 && (
          <div className="grid grid-cols-6 gap-2 my-5">
            {imagesPreview.map((img, index) => (
              <div key={index} className="relative col-span-1 group">
                <Image
                  src={img}
                  alt="Preview"
                  className="col-span-1 object-contain shadow-sm rounded-sm border-2 border-gray p-2 h-full w-full"
                  width="50"
                  height="50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          disabled={
            loading || (images.length === 0 && imagesPreview.length === 0)
          }
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
});

UploadImages.displayName = 'UploadImages';

export default UploadImages;
