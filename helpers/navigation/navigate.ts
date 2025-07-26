export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = 100; // Adjust based on your navbar height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Optional: Update URL hash without page reload
    window.history.replaceState(null, "", `#${id}`);
  }
};

export const toInitial = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
  // Clean URL hash
  window.history.replaceState(null, "", window.location.pathname);
};
