document.addEventListener("DOMContentLoaded", function () {
  start();
});

let categorizedQuestions = {};

async function start() {
  registerButtons();
  await getQuestions();
}

function registerButtons() {
  document.querySelector(".card").addEventListener("click", flipCard);
  const buttons = document.querySelectorAll(".categories button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      DisplayCard(category);
      document.querySelector(".overlay").style.display = "none";
    });
  });
}

async function getQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    categorizedQuestions = data.categories.reduce((acc, category) => {
      acc[category.name] = category.questions;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function flipCard() {
  const card = document.querySelector(".card");
  card.classList.toggle("flipped");
}

function DisplayCard(category) {
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");

  setTimeout(() => {
    const card = document.querySelector(".card");
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");

    let selectedCategory;
    if (category === "random") {
      const categoryNames = Object.keys(categorizedQuestions);
      selectedCategory =
        categoryNames[Math.floor(Math.random() * categoryNames.length)];
    } else {
      selectedCategory = category;
    }

    const categoryQuestions = categorizedQuestions[selectedCategory];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const randomQuestion = categoryQuestions[randomIndex];

    front.innerText = randomQuestion.question;
    back.innerText = randomQuestion.answer;

    card.classList.remove(
      "category1",
      "category2",
      "category3",
      "category4",
      "category5"
    );

    card.classList.add("category" + selectedCategory);
  }, 300);

  setTimeout(() => {
    container.classList.remove("zoom-out");
    container.classList.add("zoom-in");
  }, 300);
}
