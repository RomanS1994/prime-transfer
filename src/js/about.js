const cards = document.querySelectorAll('.card');

// Почергово призначаємо напрям (якщо не зроблено в HTML)
cards.forEach((card, index) => {
  if (!card.dataset.direction) {
    card.dataset.direction = index % 2 === 0 ? 'left' : 'right';
  }
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // Щоб анімація була один раз
      }
    });
  },
  {
    threshold: 0.3,
  }
);

cards.forEach(card => observer.observe(card));
