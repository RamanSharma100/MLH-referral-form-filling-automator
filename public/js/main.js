window.onload = () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const drg_txt = document.querySelector(".drg-txt");
  const file_name = document.querySelector(".file-name");

  form.addEventListener("dragover", (e) => {
    e.preventDefault();
    form.classList.add("dragover");
  });

  form.addEventListener("dragleave", (e) => {
    e.preventDefault();
    form.classList.remove("dragover");
  });

  form.addEventListener("drop", (e) => {
    e.preventDefault();
    form.classList.remove("dragover");
    input.files = e.dataTransfer.files;

    if (input.files.length > 0) {
      drg_txt.classList.add("hidden");
      file_name.classList.remove("hidden");
      file_name.innerHTML =
        input.files[0].name + " uploaded and automation started";

      const formData = new FormData();
      formData.append("file", input.files[0]);
      fetch("/start", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    }
  });
};
