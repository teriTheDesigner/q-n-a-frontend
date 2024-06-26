document.addEventListener("DOMContentLoaded", function () {
  start();
});

let allQuestions = {};
let displayedCards = [];
let selectedCategory;
let currentQuestion = {};
let currentCardIndex = 0;

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
    .querySelector(".mobile-button.mobile-button-previous")
    .addEventListener("click", displayPreviousQuestion);
  document
    .querySelector(".button.next")
    .addEventListener("click", displayNextQuestion);
  document
    .querySelector(".mobile-button.mobile-button-next")
    .addEventListener("click", displayNextQuestion);
  const buttons = document.querySelectorAll(".categories button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      selectedCategory = category;
      DisplayCard(category);
      document.querySelector(".overlay").style.display = "none";
      document.querySelector(".container").classList.remove("hidden");
    });
  });
}

async function getQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    allQuestions = data.categories.reduce((acc, category) => {
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
  updateCardContents(category);
  updateButtons();
  animateContainer();
}

function updateCardContents(category) {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });
  setTimeout(() => {
    if (category === "random") {
      handleRandomCategory();
    } else {
      handleSpecificCategory(category);
    }
  }, 300);
}

function handleRandomCategory() {
  const categoryNames = Object.keys(allQuestions);
  const nonEmptyCategories = categoryNames.filter(
    (cat) => allQuestions[cat].length > 0
  );

  if (nonEmptyCategories.length === 0) {
    disableAllCategoryButtons();
    disableRandomCategoryButton();
    return;
  }

  selectedCategory =
    nonEmptyCategories[Math.floor(Math.random() * nonEmptyCategories.length)];
  updateQuestion(selectedCategory);
}

function handleSpecificCategory(category) {
  selectedCategory = category;
  const categoryQuestions = allQuestions[selectedCategory];

  if (categoryQuestions.length === 0) {
    disableCategoryButton(selectedCategory);
    return;
  }

  updateQuestion(selectedCategory);
}

function updateQuestion(category) {
  const card = document.querySelector(".card");
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");

  const categoryQuestions = allQuestions[category];
  const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  const randomQuestion = categoryQuestions[randomIndex];

  categoryQuestions.splice(randomIndex, 1);
  displayedCards.push(randomQuestion);

  // front.innerText = randomQuestion.question;
  if (randomQuestion.questionImage) {
    front.classList.add("questionImage");
    front.innerHTML = `${randomQuestion.question}<img src="${randomQuestion.questionImage}" alt="Question Image">`;
  } else {
    front.classList.remove("questionImage");
    front.innerText = randomQuestion.question;
  }
  if (randomQuestion.answerImage) {
    back.innerHTML = `${randomQuestion.answer}<img src="${randomQuestion.answerImage}" alt="Answer Image">`;
  } else {
    back.innerText = randomQuestion.answer;
  }

  card.classList.remove(
    "category1",
    "category2",
    "category3",
    "category4",
    "category5"
  );
  card.classList.add("category" + category);
  currentQuestion = randomQuestion;
  currentCardIndex = displayedCards.length - 1;
}

function disableAllCategoryButtons() {
  document.querySelectorAll(".categories button").forEach((button) => {
    button.classList.add("disabled");
  });
}

function disableCategoryButton(category) {
  let categoryButton = document.querySelector(
    `.categories button[data-category="${category}"]`
  );
  categoryButton.classList.add("disabled");
}

function disableRandomCategoryButton() {
  let randomCategoryButton = document.querySelector('[data-category="random"]');
  randomCategoryButton.classList.remove("random-category");
  randomCategoryButton.classList.add("disabled");
}

function updateButtons() {
  const previousButton = document.querySelector(".button.previous");
  const mobilePreviousButton = document.querySelector(
    ".mobile-button.mobile-button-previous"
  );
  const mobileNextButton = document.querySelector(
    ".mobile-button.mobile-button-next"
  );
  const nextButton = document.querySelector(".button.next");

  if (currentCardIndex <= 0) {
    console.log(currentCardIndex, "currentCardIndex = 0");
    previousButton.classList.add("disabled");
    mobilePreviousButton.classList.add("mobile-button-disabled");
  } else {
    console.log(currentCardIndex, "currentCardIndex else");
    previousButton.classList.remove("disabled");
    mobilePreviousButton.classList.remove("mobile-button-disabled");
  }

  if (currentCardIndex >= displayedCards.length - 1) {
    nextButton.classList.add("disabled");
    mobileNextButton.classList.add("mobile-button-disabled");
  } else {
    nextButton.classList.remove("disabled");
    mobileNextButton.classList.remove("mobile-button-disabled");
  }
}

function animateContainer() {
  const container = document.querySelector(".container");

  setTimeout(() => {
    container.classList.remove("zoom-out");
    container.classList.add("zoom-in");
  }, 300);
}

function displayPreviousQuestions() {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = "";

  displayedCards.forEach((question, index) => {
    const categoryNumber = question.category.match(/\d+/)[0];
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("category" + categoryNumber);
    card.classList.remove("flipped");

    const front = document.createElement("div");
    front.classList.add("front");
    front.innerText = question.question;

    const back = document.createElement("div");
    back.classList.add("back");
    back.innerText = question.answer;

    card.appendChild(front);
    card.appendChild(back);

    cardContainer.appendChild(card);
  });
}

function displayPreviousQuestion() {
  if (displayedCards.length === 0 || currentCardIndex === 0) {
    return;
  }

  currentCardIndex--;

  const previousQuestion = displayedCards[currentCardIndex];
  const categoryNumber = previousQuestion.category.match(/\d+/)[0];

  const card = document.querySelector(".card");
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");

  card.classList.remove("flipped");

  setTimeout(() => {
    // front.innerText = previousQuestion.question;
    if (previousQuestion.questionImage) {
      front.classList.add("questionImage");
      front.innerHTML = `${previousQuestion.question}<img src="${previousQuestion.questionImage}" alt="Question Image">`;
    } else {
      front.classList.remove("questionImage");
      front.innerText = previousQuestion.question;
    }
    if (previousQuestion.answerImage) {
      back.innerHTML = `${previousQuestion.answer}<img src="${previousQuestion.answerImage}" alt="Answer Image">`;
    } else {
      back.innerText = previousQuestion.answer;
    }

    card.classList.remove(
      "category1",
      "category2",
      "category3",
      "category4",
      "category5"
    );
    card.classList.add("category" + categoryNumber);

    updateButtons();
  }, 300);

  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  animateContainer();
}

function displayNextQuestion() {
  if (
    displayedCards.length === 0 ||
    currentCardIndex === displayedCards.length - 1
  ) {
    return;
  }

  currentCardIndex++;

  const nextQuestion = displayedCards[currentCardIndex];
  const categoryNumber = nextQuestion.category.match(/\d+/)[0];

  const card = document.querySelector(".card");
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");

  card.classList.remove("flipped");

  setTimeout(() => {
    // front.innerText = nextQuestion.question;
    if (nextQuestion.questionImage) {
      front.classList.add("questionImage");
      front.innerHTML = `${nextQuestion.question}<img src="${nextQuestion.questionImage}" alt="Question Image">`;
    } else {
      front.classList.remove("questionImage");
      front.innerText = nextQuestion.question;
    }
    if (nextQuestion.answerImage) {
      back.innerHTML = `${nextQuestion.answer}<img src="${nextQuestion.answerImage}" alt="Answer Image">`;
    } else {
      back.innerText = nextQuestion.answer;
    }

    card.classList.remove(
      "category1",
      "category2",
      "category3",
      "category4",
      "category5"
    );
    card.classList.add("category" + categoryNumber);

    updateButtons();
  }, 300);

  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  animateContainer();
}
