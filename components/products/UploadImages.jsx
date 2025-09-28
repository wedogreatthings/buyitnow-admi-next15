/* eslint-disable react/prop-types */
'use client';

import React, { useContext, useState, useEffect, memo } from 'react';
import { toast } from 'react-toastify';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import ProductContext from '@/context/ProductContext';
import axios from 'axios';

const UploadImages = memo(({ id }) => {
  const {
    addProductImages,
    productImages,
    removeProductImage,
    error,
    loading,
    clearErrors,
  } = useContext(ProductContext);

  const [isRemoving, setIsRemoving] = useState({});
  const [uploadConfig, setUploadConfig] = useState(null);

  // Récupérer la configuration d'upload au montage du composant
  useEffect(() => {
    const fetchUploadConfig = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/sign`,
        );
        setUploadConfig(data);
      } catch (error) {
        console.error('Failed to fetch upload config:', error);
        toast.error('Failed to initialize upload configuration');
      }
    };

    fetchUploadConfig();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleUploadSuccess = (result) => {
    // Quand l'upload est réussi, ajouter l'image au produit
    const newImage = {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    };

    // Appeler la méthode du context pour ajouter l'image à la base de données
    addProductImages([newImage], id);

    toast.success('Image uploaded successfully!');
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    toast.error('Failed to upload image');
  };

  const handleRemoveImage = async (imageToRemove) => {
    if (imageToRemove._id) {
      try {
        // Start removal animation
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: true }));

        // Wait a moment for animation before actual removal
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Call context method to remove image
        await removeProductImage(id, imageToRemove._id);

        toast.success('Image removed successfully');
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // Revert removal animation if failed
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: false }));
        toast.error('Failed to remove image');
      }
    }
  };

  // Configuration pour l'upload widget
  const getWidgetOptions = () => {
    if (!uploadConfig) return {};

    return {
      multiple: true,
      maxFiles: 10,
      folder: 'buyitnow/products',
      resourceType: 'image',
      clientAllowedFormats: ['jpeg', 'jpg', 'png', 'webp'],
      maxFileSize: 5000000, // 5MB
      sources: ['local', 'url', 'camera'],
      showAdvancedOptions: false,
      cropping: false,
      styles: {
        palette: {
          window: '#ffffff',
          sourceBg: '#f4f4f5',
          windowBorder: '#90a0b3',
          tabIcon: '#000000',
          inactiveTabIcon: '#555a5f',
          menuIcons: '#555a5f',
          link: '#0433ff',
          action: '#339933',
          inProgress: '#0433ff',
          complete: '#339933',
          error: '#cc0000',
          textDark: '#000000',
          textLight: '#fcfffd',
        },
      },
    };
  };

  if (!uploadConfig) {
    return (
      <div
        style={{ maxWidth: '480px' }}
        className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded-sm bg-white shadow-lg"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading upload configuration...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ maxWidth: '480px' }}
      className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded-sm bg-white shadow-lg"
    >
      <h2 className="mb-3 text-2xl font-semibold">Upload Product Images</h2>

      {/* Cloudinary Upload Widget */}
      <div className="mb-4">
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={getWidgetOptions()}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full px-4 py-2 text-center text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Images'}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Existing Product Images */}
      {productImages && productImages.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-medium">
            Current Images ({productImages.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 my-5">
            {productImages.map((img) => (
              <div key={img._id} className="relative group">
                <div className="aspect-square">
                  <CldImage
                    src={img.public_id}
                    alt="Product image"
                    width={150}
                    height={150}
                    crop="fill"
                    gravity="center"
                    className={`object-cover rounded-sm border-2 border-gray-300 transition-all duration-300 w-full h-full hover:border-blue-400 ${
                      isRemoving[img._id] ? 'opacity-0 scale-75' : 'opacity-100'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 disabled:opacity-50"
                  disabled={loading}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune image */}
      {(!productImages || productImages.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>No images uploaded yet</p>
          <p className="text-sm">Click &quot;Add Images&quot; to get started</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Instructions:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click &quot;Add Images&quot; to upload new product images</li>
          <li>• Supported formats: JPEG, JPG, PNG, WebP</li>
          <li>• Maximum file size: 5MB per image</li>
          <li>• You can upload up to 10 images at once</li>
          <li>• Hover over existing images to remove them</li>
          <li>• Images are automatically optimized for web</li>
        </ul>
      </div>
    </div>
  );
});

UploadImages.displayName = 'UploadImages';

export default UploadImages;
