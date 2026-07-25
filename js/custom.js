(function () {
  "use strict";

  function selectGalleryImage(trigger) {
    var popupId = trigger.getAttribute("data-popup-id");
    var imageIndex = Number(trigger.getAttribute("data-gallery-index"));
    var slider = document.querySelector(
      '.popup[data-popup-id="' + popupId + '"] .slider'
    );

    if (!slider || !Number.isInteger(imageIndex)) {
      return;
    }

    Array.prototype.forEach.call(slider.children, function (slide, index) {
      slide.classList.toggle("selected", index === imageIndex);
      slide.classList.remove("hide");
    });
  }

  function moveGallery(direction) {
    var slider = document.querySelector(
      '.popup.visible[data-popup-id="75-1"] .slider'
    );

    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.children);
    var currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("selected");
    });
    var nextIndex = (currentIndex + direction + slides.length) % slides.length;

    slides.forEach(function (slide, index) {
      slide.classList.toggle("selected", index === nextIndex);
      slide.classList.remove("hide");
    });
  }

  var touchStartX = null;

  document.addEventListener(
    "click",
    function (event) {
      var trigger = event.target.closest(".clean-image-grid .popupTrigger");

      if (trigger) {
        event.preventDefault();
        selectGalleryImage(trigger);
        return;
      }

      var arrow = event.target.closest("[data-gallery-action]");

      if (arrow) {
        event.preventDefault();
        event.stopPropagation();
        moveGallery(arrow.getAttribute("data-gallery-action") === "next" ? 1 : -1);
        return;
      }

      var carouselArrow = event.target.closest("[data-carousel-action]");

      if (carouselArrow) {
        event.preventDefault();
        event.stopPropagation();
        var carousel = carouselArrow.parentNode.querySelector(".clean-image-grid");
        var firstCard = carousel.querySelector("li");
        var distance = firstCard ? firstCard.getBoundingClientRect().width + 16 : 300;

        carousel.scrollBy({
          left: carouselArrow.getAttribute("data-carousel-action") === "next" ? distance : -distance,
          behavior: "smooth"
        });
      }
    },
    true
  );

  document.addEventListener("click", function (event) {
    if (event.target.closest(".tool-grid .box-74")) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!document.querySelector('.popup.visible[data-popup-id="75-1"]')) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveGallery(event.key === "ArrowRight" ? 1 : -1);
    }
  });

  document.addEventListener("touchstart", function (event) {
    if (event.target.closest('.popup.visible[data-popup-id="75-1"] .gallery-viewer')) {
      touchStartX = event.changedTouches[0].clientX;
    }
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    if (touchStartX === null) {
      return;
    }

    var distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(distance) >= 50) {
      moveGallery(distance < 0 ? 1 : -1);
    }
  }, { passive: true });
})();
