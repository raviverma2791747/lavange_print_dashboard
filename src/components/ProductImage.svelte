<!-- <script>

const imageUpload = async () => {
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        previewImages = [
          ...previewImages,
          {
            id: reader.result,
            url: reader.result
          },
        ];
      });

      reader.readAsDataURL(file);

      const data = await updateImage(file);

      console.log(data)
      if (data.status === 200) {
        product.assets = [
          ...product.assets,
          {
            id: data.data.img.id,
          },
        ];
      } else {
      }
    }
  };

</script>


<div class="h-48 w-48 border border-gray-200 rounded-lg">
    <img class="h-auto max-w-full" src={previewImage.url} />
  </div> -->