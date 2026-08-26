
    const header = document.querySelector("#header");
    const menuToggle = document.querySelector("#menuToggle");
    const closeNavigation = document.querySelector("#closeNavigation");
    const mobileNavigation = document.querySelector("#mobileNavigation");
    const mobileLinks = mobileNavigation.querySelectorAll("a");

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    });

    function openMenu() {
      mobileNavigation.classList.add("active");
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      mobileNavigation.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    menuToggle.addEventListener("click", openMenu);
    closeNavigation.addEventListener("click", closeMenu);
    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    const counters = document.querySelectorAll("[data-count]");
    let countersStarted = false;

    function animateCounters() {
      if (countersStarted) return;
      countersStarted = true;

      counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        let value = 0;
        const increment = Math.max(1, Math.ceil(target / 35));

        const update = () => {
          value += increment;

          if (value >= target) {
            counter.textContent = target + (target === 100 ? "%" : "+");
            return;
          }

          counter.textContent = value;
          requestAnimationFrame(update);
        };

        update();
      });
    }

    const statsSection = document.querySelector(".stats");

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);

  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const textToCopy = button.dataset.copy;

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);

        const original = button.innerHTML;

        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        button.setAttribute("aria-label", "Copied");

        setTimeout(() => {
          button.innerHTML = original;
          button.setAttribute("aria-label", "Copy account detail");
        }, 1600);
      } catch (error) {
        console.error("Could not copy text:", error);
        alert("Could not copy automatically. Please copy it manually.");
      }
    });
  });

    document.querySelector("#contactForm").addEventListener("submit", (event) => {
      event.preventDefault();

      const button = event.target.querySelector("button");
      const original = button.innerHTML;

      button.innerHTML = '<i class="fa-solid fa-check"></i> Message sent';
      button.style.background = "#198754";

      event.target.reset();

      setTimeout(() => {
        button.innerHTML = original;
        button.style.background = "";
      }, 3000);
    });
