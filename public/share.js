const image = document.querySelector("#shared-image");
if (image) {
  const showError = () => {
    image.parentElement.hidden = true;
    document.querySelector("#image-error").hidden = false;
  };
  image.addEventListener("error", showError);
  if (image.complete && !image.naturalWidth) showError();
}
