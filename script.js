document.addEventListener("DOMContentLoaded", function () {
  start();
});

let categorizedQuestions = {};
let displayedCards = [];
let currentCardIndex = null;

async function start() {
  registerButtons();
  await getQuestions();
}

function registerButtons() {
  document.querySelector(".card").addEventListener("click", flipCard);
  document
    .querySelector(".button.previous")
    .addEventListener("click", displayPreviousQuestion);
  document
    .querySelector(".button.next")
    .addEventListener("click", displayNextQuestion);
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
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.classList.remove("hidden");
    button.classList.add("display");
  });

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

    displayedCards.push({
      category: selectedCategory,
      questionIndex: randomIndex,
    });

    currentCardIndex = displayedCards.length - 1;

    // Check if there is a previous card available
    if (currentCardIndex === 0) {
      document.querySelector(".button.previous").classList.add("hidden");
    } else {
      document.querySelector(".button.previous").classList.remove("hidden");
    }
  }, 300);

  setTimeout(() => {
    container.classList.remove("zoom-out");
    container.classList.add("zoom-in");
  }, 300);
}

function displayPreviousQuestion() {
  if (currentCardIndex === null || currentCardIndex <= 0) return;
  currentCardIndex--;
  const previousCard = displayedCards[currentCardIndex];
  const category = previousCard.category;
  const questionIndex = previousCard.questionIndex;
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");

  setTimeout(() => {
    const card = document.querySelector(".card");
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");

    const categoryQuestions = categorizedQuestions[category];
    const question = categoryQuestions[questionIndex];

    front.innerText = question.question;
    back.innerText = question.answer;

    card.classList.remove(
      "category1",
      "category2",
      "category3",
      "category4",
      "category5"
    );

    card.classList.add("category" + category);

    // Update current card index
    currentCardIndex--;

    // Update visibility of previous button
    if (currentCardIndex === 0) {
      document.querySelector(".button.previous").classList.add("hidden");
    } else {
      document.querySelector(".button.previous").classList.remove("hidden");
    }
  }, 300);

  setTimeout(() => {
    container.classList.remove("zoom-out");
    container.classList.add("zoom-in");
  }, 300);
}

function displayNextQuestion() {
  if (
    currentCardIndex === null ||
    currentCardIndex >= displayedCards.length - 1
  )
    return;
  currentCardIndex++;
  const nextCard = displayedCards[currentCardIndex];
  DisplayCard(nextCard.category);
}
