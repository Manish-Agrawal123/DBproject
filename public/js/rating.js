const initStarRating = ()=>{  
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("ratingInput");

  if (!stars.length || !ratingInput) return;

  let selectedRating = 0;

  stars.forEach((star, index) => {

    star.addEventListener("click", () => {
      selectedRating = Number(index + 1);   // 👈 FORCE NUMBER
      ratingInput.value = selectedRating;
      highlight(index);
    });

    star.addEventListener("mouseover", () => highlight(index));
    star.addEventListener("mouseout", () => highlight(selectedRating - 1));
  });

  function highlight(index) {
    stars.forEach(star => star.classList.remove("active"));
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add("active");
    }
  }
}
initStarRating();


