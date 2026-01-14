import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel.css";

function Carousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const navigate = useNavigate();
  let timeOut = null;

  useEffect(() => {
    timeOut =
      autoPlay &&
      setTimeout(() => {
        slideRight();
      }, 5500);
  });

  const slideRight = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const slideLeft = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const handleCTAClick = (action) => {
    if (action === "scroll") {
      const heroSection = document.querySelector('.hero-stats');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action) {
      navigate(action);
    }
  };

  return (
    <div
      className="carousel"
      onMouseEnter={() => {
        setAutoPlay(false);
        clearTimeout(timeOut);
      }}
      onMouseLeave={() => {
        setAutoPlay(true);
      }}
    >
      <div className="carousel_wrapper">
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className={
                index === current
                  ? "carousel_card carousel_card-active"
                  : "carousel_card"
              }
            >
              <img className="card_image" src={image.image} alt="" />
              <div className="card_overlay">
                <div className="card_content">
                  <h1 className="card_title">{image.title}</h1>
                  <h2 className="card_subtitle">{image.subtitle}</h2>
                  <p className="card_description">{image.description}</p>
                  {image.cta && (
                    <button
                      className="card_cta"
                      onClick={() => handleCTAClick(image.action)}
                    >
                      {image.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="carousel_arrow_left" onClick={slideLeft}>
          &lsaquo;
        </div>
        <div className="carousel_arrow_right" onClick={slideRight}>
          &rsaquo;
        </div>
        <div className="carousel_pagination">
          {images.map((_, index) => {
            return (
              <div
                key={index}
                className={
                  index === current
                    ? "pagination_dot pagination_dot-active"
                    : "pagination_dot"
                }
                onClick={() => setCurrent(index)}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Carousel;