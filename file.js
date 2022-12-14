"use strict";
//Defining all of the document element
const views = document.getElementById("views");
const cost = document.getElementById("cost");
const progress = document.getElementById("progress");
const progressInput = document.querySelector("#progress .hidden");
const progressValue = document.getElementById("progressValue");
const box = document.getElementById("box");
const switchPlan = document.getElementById("switchPlan");
const checkbox = document.getElementById("checkbox");
//Define all of the initial measures
let windowWidth = window.innerWidth;
let progressWidth = progress.offsetWidth;
let planIsChecked = false;
//recalculating all the initial measures onresize
window.onresize = function () {
  windowWidth = window.innerWidth;
  progressWidth = progress.offsetWidth;
};
//function to convert nums into dollars
function formater(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}
//function to convert the pageviews into dollars
function convertViewsIntoDollars(num) {
  let val = planIsChecked ? (num / 6.25) * 0.75 : num / 6.25;

  return formater(val);
}
//function to dynamically handle the move of the progress bar on mousemove
function movealong(event) {
  const emptyLeft = (windowWidth - progressWidth) / 2;
  let percent = ((event.clientX - emptyLeft) * 100) / progressWidth;
  percent = percent >= 100 ? 100 : percent <= 0 ? 0 : percent;
  progressValue.style.width = percent + "%";
  if (
    event.clientX <= emptyLeft - 20 ||
    event.clientX - 20 >= emptyLeft + progressWidth
  ) {
    document.body.removeEventListener("mousemove", movealong);
  }
  let pageViews = Math.round(percent) * 2;
  let costValue = convertViewsIntoDollars(pageViews);
  views.innerText = pageViews + "K";
  cost.innerText = costValue;
}
//function to handle mousedown
progress.onmousedown = function (event) {
  const emptyLeft = (windowWidth - progressWidth) / 2;
  const percent = ((event.clientX - emptyLeft) * 100) / progressWidth;
  progressValue.style.width = percent + "%";
  document.body.addEventListener("mousemove", movealong);
  let pageViews = Math.round(percent) * 2;
  let costValue = convertViewsIntoDollars(pageViews);
  views.innerText = pageViews + "K";
  cost.innerText = costValue;
  box.onmouseup = function () {
    document.body.removeEventListener("mousemove", movealong);
  };
  box.onmouseleave = function () {
    document.body.removeEventListener("mousemove", movealong);
  };
};
//function to handleKeyboard
const handleKeyboard = function (e) {
  let width = +progressValue.style.width.split("%")[0];
  if (e.key == "ArrowRight") {
    width += 1;
    width = width >= 100 ? 100 : width <= 0 ? 0 : width;
    progressValue.style.width = width + "%";
  } else if (e.key == "ArrowLeft") {
    width -= 1;
    width = width >= 100 ? 100 : width <= 0 ? 0 : width;
    progressValue.style.width = width + "%";
  }
  let pageViews = Math.round(width) * 2;
  let costValue = convertViewsIntoDollars(pageViews);
  views.innerText = pageViews + "K";
  cost.innerText = costValue;
};
//function to add the event to the keyboard
progressInput.onfocus = function () {
  progress.addEventListener("keydown", handleKeyboard);
  progressInput.onblur = function () {
    progress.removeEventListener("keydown", handleKeyboard);
  };
};
//function to handle the switch of plan
switchPlan.onchange = function () {
  planIsChecked = !planIsChecked;
  let costValue;
  if (checkbox.checked) {
    costValue = (views.innerText.split("K")[0] / 6.25) * 0.75;
    costValue = formater(costValue);
  } else {
    costValue = views.innerText.split("K")[0] / 6.25;
    costValue = formater(costValue);
  }
  cost.innerText = costValue;
};
