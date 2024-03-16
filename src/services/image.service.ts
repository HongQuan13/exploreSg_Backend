import cloudinary from "../configs/cloudinary.config";
import { imageModel, placeModel } from "../models/place.model";
import { extractPublicId } from "../utils";

interface uploadedUrls {
  [key: string]: any;
}

class ImageService {
  static uploadImageFromLocal = async ({
    path,
    folderName = "exploreSG",
  }: {
    path: string;
    folderName?: string;
  }) => {
    try {
      console.log(path, folderName);
      const uploadImage = await cloudinary.uploader.upload(path, {
        folder: folderName,
      });
      console.log(uploadImage);
      return {
        img_url: uploadImage.secure_url,
        folder: uploadImage.folder,
        original_fileName: uploadImage.original_filename,
      };
    } catch (error: any) {
      console.log(error.stack);
    }
  };
  static createImage = async (images: any) => {
    try {
      let uploadObject = await ImageService.uploadImageFromLocal({
        path: images,
      });
      const uploadImgUrl = uploadObject?.img_url;
      if (!uploadImgUrl) throw new Error("img url missing error");
      const folderName = uploadObject?.folder;
      const original_fileName = uploadObject?.original_fileName;
      const newImage = await imageModel.create({
        img_url: uploadImgUrl,
        img_filename: `${folderName}-${original_fileName}`,
      });
      console.log("create new image model successfull", newImage);
      return newImage;
    } catch (error: any) {
      console.log(error.stack);
    }
  };

  static createMultipleImages = async ({
    images,
    folderName = "exploreSG",
  }: {
    images: any;
    folderName?: string;
  }) => {
    try {
      console.log("files::", images, folderName);
      if (!images.length) return;
      const uploadedImagesUrl: uploadedUrls = [];
      for (const image of images) {
        const uploadImage = await cloudinary.uploader.upload(image.path, {
          folder: folderName,
        });
        uploadedImagesUrl.push({
          img_url: uploadImage.secure_url,
          folder: uploadImage.folder,
          original_fileName: uploadImage.original_filename,
          public_id: uploadImage.public_id,
          thumb_url: await cloudinary.url(uploadImage.public_id, {
            height: 369,
            width: 560,
            format: "jpg",
          }),
        });
      }
      let uploadedImages: uploadedUrls = [];
      await Promise.all(
        uploadedImagesUrl.map(async (uploadedObject: any) => {
          const imgUrl = uploadedObject?.img_url;
          const thumbUrl = uploadedObject?.thumb_url;
          const original_fileName = uploadedObject?.original_fileName;
          const public_id = uploadedObject?.public_id;

          const newImage = await imageModel.create({
            img_url: imgUrl,
            img_filename: `${folderName}-${original_fileName}`,
            thumb_url: thumbUrl,
            public_id: public_id,
          });
          uploadedImages.push(newImage);
        })
      );
      return uploadedImages;
    } catch (error: any) {
      console.log(error.stack);
    }
  };
  static updateImages = async ({
    place_id,
    delete_images = [],
    new_images = [],
  }: {
    place_id: string;
    delete_images?: any;
    new_images?: any;
  }) => {
    let uploadNewImages: any = [];
    if (new_images.length) {
      uploadNewImages = await ImageService.createMultipleImages({
        images: new_images,
      });
      console.log("update:: uploadNewImages", uploadNewImages);
    }
    console.log(uploadNewImages, "uploadNewImages");
    if (delete_images) {
      for (const delete_image of delete_images) {
        const deletedImage = await imageModel.findByIdAndDelete(delete_image);
        if (deletedImage) {
          const public_id = deletedImage.public_id;
          if (!public_id) throw new Error("public_id image not exist");
          console.log(public_id, "public_id deleted images");
          await cloudinary.uploader.destroy(
            public_id,
            function (error: any, result: any) {
              console.log(result, error, "cloudinary");
            }
          );
        }
        const query = { _id: place_id },
          updateOperation = { $pull: { place_images: { _id: delete_image } } };
        await placeModel.updateOne(query, updateOperation);
        console.log("update:: delete_image", delete_image);
      }
    }
    return uploadNewImages;
  };

  static deleteImages = async (delete_images: any) => {
    for (const delete_image of delete_images) {
      const id = delete_image._id;
      const deletedImage = await imageModel.findByIdAndDelete(id);
      if (deletedImage) {
        const public_id = deletedImage.public_id;
        if (!public_id) throw new Error("public_id image not exist");
        await cloudinary.uploader.destroy(
          public_id,
          function (error: any, result: any) {
            console.log(result, error, "cloudinary");
          }
        );
      }
    }
  };
}

export default ImageService;
